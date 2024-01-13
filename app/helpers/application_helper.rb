module ApplicationHelper
  def get_active_by_pathname(path) # rubocop:disable Naming/AccessorMethodName
    current_path = request.path
    current_path == path ? 'actived' : ''
  end
end
