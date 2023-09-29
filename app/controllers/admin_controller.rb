class AdminController < ApplicationController
  before_action :authenticate_user!
  before_action :check_admin_role
  
    # def users
    #   @users = User.all
    #   puts "Current User: #{current_user.inspect}" # Add this line for debugging

    # end
  
    # private
  
    # def check_admin_role
    #   if current_user.has_role?(:admin)
    #     # Allow access for users with the 'admin' role
    #   else
    #     flash[:alert] = "You don't have permission to access this page."
    #     redirect_to root_path
    #   end
    # end
    
end