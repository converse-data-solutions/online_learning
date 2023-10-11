# frozen_string_literal: true

# This is an Admin User controller
class Admin::UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :check_admin_role

  def index
    @users = User.all
    @new_admin = User.new
  end

  def new
    @user = User.new
  end

  def create
    @new_admin = User.new(new_admin_params)

    if @new_admin.save
      @new_admin.send_reset_password_instructions
      flash[:notice] = 'Admin user created successfully.'
      redirect_to admin_users_path
    else
      flash[:alert] = 'Failed to create admin user.'
      @users = User.all
      render :index
    end
  end

  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])

    if @user == current_user
      handle_own_status_change
    else
      handle_user_status_change
    end

    redirect_to admin_users_path
  end

  def destroy
    user = User.find(params[:id])

    if user == current_user
      flash[:alert] = 'You cannot delete yourself.'
    else
      user.update(deleted: true)
      flash[:notice] = 'User deleted successfully.'
    end

    redirect_to admin_users_path
  end

  private

  def handle_own_status_change
    flash[:alert] = 'You cannot change your own status.'
  end

  def handle_user_status_change
    new_role = user_params[:role]
    new_status = params[:user][:deleted].to_s == 'true'

    if @user.add_role(new_role) && @user.update(deleted: new_status)
      flash[:notice] = 'User information updated successfully.'
    else
      flash[:alert] = 'Failed to update user information.'
    end
  end

  def user_params
    params.require(:user).permit(:role, :email)
  end

  def new_admin_params
    params.require(:user).permit(:email, :password, :password_confirmation, :role)
  end

  def check_admin_role
    return if current_user.has_role?(:admin)

    flash[:alert] = "You don't have permission to access this page."
    redirect_to root_path
  end
end
