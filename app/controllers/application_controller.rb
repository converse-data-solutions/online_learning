class ApplicationController < ActionController::Base
  # before_filter :no_deleted_users

  def no_deleted_users
    if User.find(params[:email]).deleted?
      redirect_to root_path, :flash => { :error => "Your user was deleted.  You cannot log in." } 
    end
  end
  
  def check_admin_role
    if current_user.has_role?(:admin)
      # Allow access for users with the 'admin' role
    else
      flash[:alert] = "You don't have permission to access this page."
      redirect_to root_path
    end
  end
end