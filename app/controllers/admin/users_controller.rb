# frozen_string_literal: true

# This is an Admin User controller
class Admin::UsersController < ApplicationController
  # before_action :authenticate_user!
  before_action :set_user, only: %i[edit update destroy show]
  def index
    get_users
    respond_to do |format|
      format.json { render json: { data: @users, total_count: User.admin.count } }
      format.html { render :index }
      format.turbo_stream
    end
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(admin_params)
    respond_to do |format|
      if @user.valid? && @user.add_role_and_save(admin_params[:role])
        get_users
        format.turbo_stream
        format.json { render_created_user }
      else
        render_invalid_user(format)
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
        get_users
        format.turbo_stream
        format.json { render :show, status: :ok, location: admin_user_url(@user) }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.update('edit-user-popup', partial: 'admin/users/edit', locals: { user: @user }) } # rubocop:disable Layout/LineLength
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    respond_to do |format|
      if @user&.update(deleted: true)
        get_users
        format.turbo_stream { render_destroy_success }
        format.json { render :show, status: :ok, location: admin_user_url(@user) }
      else
        format.turbo_stream { redirect_to admin_users_path, flash[:notice] = 'User destroy failed' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def render_created_user
    render json: @user, status: :created, location: admin_user_url(@user)
  end

  def render_invalid_user(format)
    format.turbo_stream { render turbo_stream: turbo_stream.replace('user-admin-form', partial: 'admin/users/form', locals: { user: @user }) }
    format.json { render json: @user.errors, status: :unprocessable_entity }
  end

  def render_destroy_success
    render turbo_stream: [
      turbo_stream.append('user-table', partial: 'shared/flash', locals: { message: 'User was successfully destroyed.', type: 'notice' }),
      turbo_stream.update('user-table', partial: 'admin/users/table', locals: { users: @users })
    ]
  end

  def get_users
    @users = User.admin.order(name: :asc).search_by_name_and_email(params[:search]).paginate(page: params[:page] || 1, per_page: params[:per_page] || 5)
  end

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
