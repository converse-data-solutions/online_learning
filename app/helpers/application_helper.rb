module ApplicationHelper
  def get_active_by_pathname(path)
    current_path = request.path
    current_path == path ? 'actived' : ''
  end

  def get_active_by_controller(_path)
    current_path = request.path
    current_path == '/admin/payments/new' ? 'actived' : ''
  end

  def get_active_by_collection(_collection)
    current_path = request.path
    current_path == '/admin/payments/collections' ? 'actived' : ''
  end
end
