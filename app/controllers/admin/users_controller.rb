class Admin::UsersController < ApplicationController
    before_action :authenticate_user!
    before_action :check_admin_role
    
    def index
        @users = User.active.all
        @new_admin = User.new
      end
      
      def new
        @user = User.new
      end
  
      def create
        @new_admin = User.new(new_admin_params)
      
        if @new_admin.save
          @new_admin.send_reset_password_instructions
          flash[:notice] = "Admin user created successfully."
          redirect_to admin_users_path
        else
          flash[:alert] = "Failed to create admin user."
          @users = User.all
          render :index
        end
      end
      
      def edit
        @user = User.find(params[:id])
      end
    
      def update
        @user = User.find(params[:id])
        if @user.add_role(user_params[:role])
          flash[:notice] = "User information updated successfully."
          redirect_to admin_users_path
        else
          flash[:alert] = "Failed to update user information."
          render :edit
        end
      end
  
    def destroy
      user = User.find(params[:id])
  
      if user == current_user
        flash[:alert] = "You cannot delete yourself."
      else
        user.update(deleted: true)
        flash[:notice] = "User deleted successfully."
      end
  
      redirect_to admin_users_path
    end
  
    private
  
    def user_params
      params.require(:user).permit(:role, :email)
    end
  
    def new_admin_params
      params.require(:user).permit(:email, :password, :password_confirmation, :role)
    end
  
    def check_admin_role
      if current_user.has_role?(:admin)
      else
        flash[:alert] = "You don't have permission to access this page."
        redirect_to root_path
      end
    end
end
