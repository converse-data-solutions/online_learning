# config/initializers/recaptcha.rb

Recaptcha.configure do |config|
  config.site_key = Rails.application.credentials[:production][:recaptcha][:recaptcha_public_key]
  config.secret_key = Rails.application.credentials[:production][:recaptcha][:recaptcha_private_key]
end
