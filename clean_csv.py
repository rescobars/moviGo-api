#!/usr/bin/env python3
"""
Script para limpiar el archivo CSV de Lightcast que tiene problemas con comas y saltos de línea.
Este script reformatea el CSV para que sea compatible con Databricks.
"""

import csv
import json
import re
from pathlib import Path

def clean_field(field):
    """
    Limpia un campo individual del CSV, manejando comas, saltos de línea y comillas.
    """
    if not field:
        return ""
    
    # Convertir a string si no lo es
    field = str(field)
    
    # Remover saltos de línea múltiples y reemplazar con espacios
    field = re.sub(r'\n+', ' ', field)
    field = re.sub(r'\r+', ' ', field)
    
    # Remover espacios múltiples
    field = re.sub(r'\s+', ' ', field)
    
    # Limpiar comillas dobles que no estén escapadas
    field = field.replace('"', '""')
    
    # Si el campo contiene comas, saltos de línea o comillas, envolver en comillas
    if ',' in field or '\n' in field or '"' in field:
        field = f'"{field}"'
    
    return field.strip()

def clean_csv(input_file, output_file):
    """
    Limpia el archivo CSV completo y crea una versión limpia.
    """
    print(f"Procesando archivo: {input_file}")
    
    with open(input_file, 'r', encoding='utf-8', errors='ignore') as infile:
        # Leer todo el contenido primero para manejar campos multilínea
        content = infile.read()
        
        # Dividir por líneas, pero ser cuidadoso con campos que contienen saltos de línea
        lines = []
        current_line = []
        in_quotes = False
        quote_count = 0
        
        for char in content:
            if char == '"':
                quote_count += 1
                in_quotes = not in_quotes
            elif char == '\n' and not in_quotes:
                if current_line:
                    lines.append(''.join(current_line))
                    current_line = []
                continue
            
            current_line.append(char)
        
        if current_line:
            lines.append(''.join(current_line))
    
    # Procesar las líneas
    cleaned_lines = []
    header_processed = False
    
    for line_num, line in enumerate(lines):
        if not line.strip():
            continue
            
        try:
            # Usar el parser CSV de Python para manejar correctamente los campos
            reader = csv.reader([line])
            row = next(reader)
            
            # Limpiar cada campo
            cleaned_row = [clean_field(field) for field in row]
            
            # Si es la primera línea (header), no limpiar tanto
            if not header_processed:
                cleaned_row = [field.replace('"', '') for field in cleaned_row]
                header_processed = True
            
            cleaned_lines.append(','.join(cleaned_row))
            
        except Exception as e:
            print(f"Error procesando línea {line_num + 1}: {e}")
            print(f"Línea problemática: {line[:100]}...")
            continue
    
    # Escribir el archivo limpio
    with open(output_file, 'w', encoding='utf-8', newline='') as outfile:
        outfile.write('\n'.join(cleaned_lines))
    
    print(f"Archivo limpio guardado en: {output_file}")
    print(f"Líneas procesadas: {len(cleaned_lines)}")

def create_databricks_compatible_version(input_file, output_file):
    """
    Crea una versión específicamente optimizada para Databricks.
    """
    print(f"Creando versión compatible con Databricks: {output_file}")
    
    # Leer el archivo original
    with open(input_file, 'r', encoding='utf-8', errors='ignore') as infile:
        content = infile.read()
    
    # Dividir en líneas
    lines = content.split('\n')
    
    # Procesar línea por línea
    processed_lines = []
    header_processed = False
    
    for line_num, line in enumerate(lines):
        if not line.strip():
            continue
            
        try:
            # Para Databricks, vamos a ser más conservadores y solo limpiar lo esencial
            if not header_processed:
                # Header: solo remover comillas extra
                cleaned_line = line.replace('"', '')
                header_processed = True
            else:
                # Datos: limpiar campos problemáticos pero mantener estructura
                # Dividir por comas, pero ser inteligente sobre dónde dividir
                fields = []
                current_field = ""
                in_quotes = False
                quote_count = 0
                
                i = 0
                while i < len(line):
                    char = line[i]
                    
                    if char == '"':
                        quote_count += 1
                        in_quotes = not in_quotes
                        current_field += char
                    elif char == ',' and not in_quotes:
                        # Es un separador real
                        fields.append(current_field.strip())
                        current_field = ""
                    else:
                        current_field += char
                    
                    i += 1
                
                # Agregar el último campo
                if current_field:
                    fields.append(current_field.strip())
                
                # Limpiar cada campo
                cleaned_fields = []
                for field in fields:
                    # Remover saltos de línea y espacios extra
                    cleaned_field = re.sub(r'\s+', ' ', field)
                    cleaned_field = cleaned_field.strip()
                    
                    # Si el campo contiene comas internas, envolver en comillas
                    if ',' in cleaned_field and not (cleaned_field.startswith('"') and cleaned_field.endswith('"')):
                        cleaned_field = f'"{cleaned_field}"'
                    
                    cleaned_fields.append(cleaned_field)
                
                cleaned_line = ','.join(cleaned_fields)
            
            processed_lines.append(cleaned_line)
            
        except Exception as e:
            print(f"Error procesando línea {line_num + 1}: {e}")
            continue
    
    # Escribir el archivo procesado
    with open(output_file, 'w', encoding='utf-8', newline='') as outfile:
        outfile.write('\n'.join(processed_lines))
    
    print(f"Versión para Databricks guardada en: {output_file}")
    print(f"Líneas procesadas: {len(processed_lines)}")

def main():
    input_file = "/Users/robinescobar/Downloads/lightcast_data.us_jobs.csv"
    
    if not Path(input_file).exists():
        print(f"Error: No se encontró el archivo {input_file}")
        return
    
    # Crear directorio de salida si no existe
    output_dir = Path("cleaned_csv")
    output_dir.mkdir(exist_ok=True)
    
    # Versión completamente limpia
    clean_output = output_dir / "lightcast_data_clean.csv"
    clean_csv(input_file, clean_output)
    
    # Versión optimizada para Databricks
    databricks_output = output_dir / "lightcast_data_databricks.csv"
    create_databricks_compatible_version(input_file, databricks_output)
    
    print("\n" + "="*50)
    print("PROCESO COMPLETADO")
    print("="*50)
    print(f"1. Archivo limpio: {clean_output}")
    print(f"2. Archivo para Databricks: {databricks_output}")
    print("\nRecomendaciones:")
    print("- Usa el archivo 'lightcast_data_databricks.csv' para Databricks")
    print("- Si sigues teniendo problemas, usa 'lightcast_data_clean.csv'")
    print("- Ambos archivos están en la carpeta 'cleaned_csv'")

if __name__ == "__main__":
    main()
