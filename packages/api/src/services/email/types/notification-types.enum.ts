export enum EmailNotificationType {
  // Authentication emails
  PASSWORDLESS_LOGIN = 'passwordless_login',
  EMAIL_VERIFICATION = 'email_verification',
  
  // Organization emails
  ORGANIZATION_INVITATION = 'organization_invitation',
  
  // Order emails
  ORDER_CREATED = 'order_created',
}
