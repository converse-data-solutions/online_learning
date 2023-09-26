class ApplicationController < ActionController::Base
    def check_admin_role
        if current_user.has_role?(:admin)
          # Allow access for users with the 'admin' role
        else
          flash[:alert] = "You don't have permission to access this page."
          redirect_to root_path
        end
      end
end
