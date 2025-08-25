import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'moviGo API',
      version: '1.0.0',
      description: 'API para la plataforma moviGo - Sistema de gestión de organizaciones y usuarios',
      contact: {
        name: 'moviGo Team',
        email: 'admin@movigo.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.movigo.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtenido del login'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Error message'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Validation failed'
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'email'
                  },
                  message: {
                    type: 'string',
                    example: 'Email is required'
                  }
                }
              }
            }
          }
        },
        AuthenticationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Authentication failed'
            },
            code: {
              type: 'string',
              example: 'INVALID_CREDENTIALS'
            }
          }
        },
        AuthorizationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Insufficient permissions'
            },
            code: {
              type: 'string',
              example: 'INSUFFICIENT_PERMISSIONS'
            }
          }
        },
        NotFoundError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Resource not found'
            },
            resource: {
              type: 'string',
              example: 'User'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation successful'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              format: 'uuid',
              example: 'bbb65bf4-53e8-4c2d-b574-41fb2a9b2a57'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@movigo.com'
            },
            name: {
              type: 'string',
              example: 'Admin Principal'
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
              example: 'ACTIVE'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-25T17:10:43.253Z'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-25T17:10:43.253Z'
            }
          }
        },
        Organization: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              format: 'uuid',
              example: 'c8d82f56-4876-4146-9739-232c3d30f785'
            },
            name: {
              type: 'string',
              example: 'moviGo Platform'
            },
            slug: {
              type: 'string',
              example: 'movigo-platform'
            },
            description: {
              type: 'string',
              example: 'Plataforma principal de moviGo'
            },
            domain: {
              type: 'string',
              example: 'movigo.com'
            },
            logo_url: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/logos/movigo.png'
            },
            website_url: {
              type: 'string',
              format: 'uri',
              example: 'https://movigo.com'
            },
            contact_email: {
              type: 'string',
              format: 'email',
              example: 'admin@movigo.com'
            },
            contact_phone: {
              type: 'string',
              example: '+502 5000-0000'
            },
            address: {
              type: 'string',
              example: 'Centro de Innovación, Zona 4, Ciudad de Guatemala'
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
              example: 'ACTIVE'
            },
            plan_type: {
              type: 'string',
              enum: ['FREE', 'BASIC', 'PRO', 'ENTERPRISE'],
              example: 'ENTERPRISE'
            },
            subscription_expires_at: {
              type: 'string',
              format: 'date-time',
              example: '2030-12-31T00:00:00.000Z'
            }
          }
        },
        Role: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              format: 'uuid',
              example: '918c12c4-3093-4e9f-b2c7-4398f3359699'
            },
            name: {
              type: 'string',
              enum: ['PLATFORM_ADMIN', 'OWNER', 'DRIVER', 'VIEWER'],
              example: 'PLATFORM_ADMIN'
            },
            description: {
              type: 'string',
              example: 'Administrador principal de la plataforma con acceso completo'
            },
            permissions: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                additionalProperties: {
                  type: 'boolean'
                }
              }
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Login successful'
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                },
                organizations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      uuid: {
                        $ref: '#/components/schemas/Organization/properties/uuid'
                      },
                      name: {
                        $ref: '#/components/schemas/Organization/properties/name'
                      },
                      slug: {
                        $ref: '#/components/schemas/Organization/properties/slug'
                      },
                      roles: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Role'
                        }
                      },
                      permissions: {
                        type: 'object',
                        additionalProperties: {
                          type: 'object',
                          additionalProperties: {
                            type: 'boolean'
                          }
                        }
                      },
                      member_since: {
                        type: 'string',
                        format: 'date-time',
                        example: '2025-08-25T17:10:43.265Z'
                      },
                      is_owner: {
                        type: 'boolean',
                        example: false
                      },
                      is_admin: {
                        type: 'boolean',
                        example: true
                      }
                    }
                  }
                },
                default_organization: {
                  $ref: '#/components/schemas/Organization'
                },
                access_token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                },
                refresh_token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                },
                expires_in: {
                  type: 'integer',
                  example: 86400,
                  description: 'Tiempo de expiración en segundos (24 horas)'
                }
              }
            }
          }
        }
      }
    }
  },
  apis: [
    'packages/api/src/routes/*.ts',
    'packages/api/src/controllers/*.ts'
  ],
  failOnErrors: true,
  verbose: true
};

export const specs = swaggerJsdoc(options);
