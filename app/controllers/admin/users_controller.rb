# frozen_string_literal: true

# This is an Admin User controller
class Admin::UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :user_assignment, only: %i[edit update destroy]

  def index
    @users = User.all
  end

  def new
    @user = User.new
  end

  def create
    @new_admin = User.new(admin_params)

    if @new_admin.save && @new_admin.add_role(user_role[:role])
      # @new_admin.save
      admin_save
    else
      admin_save_error
    end
  end

  def edit; end

  def update
    if @user == current_user
      handle_own_status_change
    else
      handle_user_status_change
    end

    redirect_to admin_users_path
  end

  def destroy
    if @user == current_user
      flash[:alert] = 'You cannot delete yourself.'
    else
      @user.update(deleted: true)
      flash[:notice] = 'User deleted successfully.'
    end

    redirect_to admin_users_path
  end

  private

  def user_assignment
    @user = User.find(params[:id])
  end

  def admin_save
    @new_admin.send_reset_password_instructions
    flash[:notice] = 'Admin user created successfully.'
    redirect_to admin_users_path
  end

  def admin_save_error
    flash[:alert] = 'Failed to create admin user.'
    @users = User.all
    render :index
  end

  def handle_own_status_change
    flash[:alert] = 'You cannot change your own status.'
  end

  def handle_user_status_change
    new_role = params[:user][:role]
    new_status = params[:user][:deleted].to_s == 'true'
    new_current_type = params[:user][:current_type]

    if update_user_information(new_role, new_status, new_current_type)
      flash[:notice] = 'User information updated successfully.'
    else
      flash[:alert] = 'Failed to update user information.'
    end
  end

  def update_user_information(new_role, new_status, new_current_type)
    return true if @user.add_role(new_role) && @user.update(deleted: new_status, current_type: new_current_type)

    false
  end

  # def user_params
  #   params.require(:user).permit(:role)
  # end

  def admin_params
    params.require(:user).permit(:email, :password, :password_confirmation, :deleted, :current_type)
  end

  def user_role
    params.require(:user)
  end
end
