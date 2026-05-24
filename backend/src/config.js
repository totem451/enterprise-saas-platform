export const config = {
  jwtSecret: process.env.JWT_SECRET || 'change_me_in_production',
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
}
