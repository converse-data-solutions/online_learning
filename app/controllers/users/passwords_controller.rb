# frozen_string_literal: true

class Users::PasswordsController < Devise::PasswordsController
  before_update :after_resetting_password_path_for, only: %i[edit update]
  # GET /resource/password/new
  # def new
  #   super
  # end

  # POST /resource/password
  # def create
  #   super
  # end

  # GET /resource/password/edit?reset_password_token=abcdef
  def edit
    super
    sign_out(resource)
    redirect_to new_user_session_path
  end

  # PUT /resource/password
  def update
    super
    sign_out(resource)
    redirect_to new_user_session_path
  end

  protected

  def after_resetting_password_path_for(resource)
    super(resource)
    sign_out(resource)
    new_user_session_path
  end

  # The path used after sending reset password instructions
  # def after_sending_reset_password_instructions_path_for(resource_name)
  #   super(resource_name)
  # end
end
