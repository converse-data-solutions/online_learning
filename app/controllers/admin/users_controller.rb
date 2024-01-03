# frozen_string_literal: true

# This is an Admin User controller
class Admin::UsersController < ApplicationController
  # before_action :authenticate_user!
  before_action :set_user, only: %i[edit update destroy show]
  def index # rubocop:disable Metrics/AbcSize,Metrics/MethodLength
    @users = []
    User.all.each do |user|
      @users.push(user)
    end
    @users = User.admin.search_by_name_and_email(params[:search]).paginate(page: params[:page], per_page: 5)
    # @users = @users.admin
    respond_to do |format|
      format.json { render json: @users }
      format.html { render :index }
      format.turbo_stream
    end
  end

  def new
    @user = User.new
  end

  def create # rubocop:disable Metrics/AbcSize
    @user = User.new(admin_params)
    respond_to do |format|
      if @user.add_role_and_save(admin_params[:role])
        format.turbo_stream { redirect_to admin_users_path, notice: 'User created successfully' }
        format.json { render :show, status: :created, location: admin_user_url(@user) }
      else
        # format.turbo_stream { render turbo_stream: turbo_stream.replace('user-admin-form', partial: 'admin/users/form', locals: { user: @user }) } # rubocop:disable Layout/LineLength
        format.turbo_stream { render turbo_stream: turbo_stream.replace('user-admin-form', partial: 'admin/users/form', locals: { user: @user }) }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit
    render layout: false
    return if @user

    flash[:alert] = 'User not found.'
    redirect_to admin_users_path
  end

  def update
    respond_to do |format|
      if @user.update(admin_params)
        format.turbo_stream { redirect_to admin_users_path, notice: 'User updated successfully' }
        format.json { render :show, status: :ok, location: admin_user_url(@user) }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.update('edit-user-popup', partial: 'admin/users/edit', locals: { user: @user }) }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    respond_to do |format|
      if @user.update(deleted: true)
        format.turbo_stream { redirect_to admin_users_path, notice: 'User deleted successfully' }
        format.json { render :show, status: :ok, location: admin_user_url(@user) }
      else
        format.turbo_stream { redirect_to admin_users_path, notice: 'User destroy failed' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def admin_params
    params.require(:user).permit(:email, :name, :password, :password_confirmation, :deleted, :current_type, :role)
  end

  def user_role
    params.require(:user)
  end
end
