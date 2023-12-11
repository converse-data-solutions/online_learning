# frozen_string_literal: true

# This is an Admin User controller
class Admin::UsersController < ApplicationController
  # before_action :authenticate_user!
  before_action :user_assignment, only: %i[edit update destroy show]
  def index
    # @users = User.all
    @users = User.search_by_name_and_email(params[:search])
    respond_to do |format|
      format.json { render json: @users }
      format.html { render :index }
      format.js { render partial: 'tablebody', locals: { users: @users }, content_type: 'text/javascript' }
    end
  end

  def student_index
    @users = User.all
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(admin_params)
    respond_to do |format|
      if @user.add_role_and_save(admin_params[:role])
        format.turbo_stream { render turbo_stream: turbo_stream.('open--user-edit-form', partial: 'admin/users/form', locals: { user: @user }) }
        format.json { render :show, status: :created, location: @user }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.replace('user-admin-form', partial: 'admin/users/form', locals: { user: @user }) }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit; end


  def update
    if @user == current_user
      flash[:alert] = 'You cannot change your own status.'
    else
      respond_to do |format|
        if @user.update(admin_params)
          format.turbo_stream { render turbo_stream: turbo_stream.replace('edit-user-popup', partial: 'admin/users/edit', locals: { user: @user }) }
          format.json { render :show, status: :ok, location: @user }
        else
          format.turbo_stream { render turbo_stream: turbo_stream.replace('edit-user-popup', partial: 'admin/users/edit', locals: { user: @user }) }
          format.json { render json: @user.errors, status: :unprocessable_entity }
        end
      end
    end
  end
  

  def destroy
    if @user == current_user
      flash[:alert] = 'You cannot delete yourself.'
    else
      @user.destroy
      flash[:notice] = 'User deleted successfully.'
    end

    redirect_to admin_users_path
  end

  private

  def user_assignment
    @user = User.find(params[:id])
  end

  def admin_save
    @user.send_reset_password_instructions
    flash[:notice] = 'Admin user created successfully.'
    redirect_to admin_users_path
  end

  def admin_save_error
    flash[:alert] = 'Failed to create admin user.'
    @users = User.all
    redirect_to new_admin_user_path
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
    params.require(:user).permit(:email, :name, :password, :password_confirmation, :deleted, :current_type, :role)
  end

  def user_role
    params.require(:user)
  end
end
