APP_CONFIG = YAML.load(
  File.read(File.expand_path('../app_config.yml',
                             __dir__)), symbolize_names: true, aliases: true
)

CURRENT_APP_CONFIG = APP_CONFIG[Rails.env]