# frozen_string_literal: true

class Admin::StudentsController < ApplicationController
  before_action :set_student, only: %i[edit update destroy show]
  def index
    @students = User.search_by_name_and_email(params[:search])
    respond_to do |format|
      format.json { render json: @students }
      format.html { render :index }
      format.turbo_stream
    end
  end

  def new
    @student = User.new
  end

  def create
    @student = User.new(student_params)
    respond_to do |format|
      if @student.add_role_and_save(student_params[:role])
        format.turbo_stream { redirect_to admin_students_path }
        format.json { render :show, status: :created, location: admin_student_url(@student) }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.replace('user-admin-form', partial: 'admin/users/form', locals: { student: @student }) }
        format.json { render json: @student.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit
    render layout: false
    return if @student

    flash[:alert] = 'User not found.'
    redirect_to admin_students_path
  end

  def update
    respond_to do |format|
      if @user.update(student_params)
        format.turbo_stream { redirect_to admin_students_path, notice: 'User updated successfully' }
        format.json { render :show, status: :ok, location: admin_student_url(@student) }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.update('edit-user-popup', partial: 'admin/users/edit', locals: { student: @student }) }
        format.json { render json: @student.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    respond_to do |format|
      if @student.update(deleted: true)
        format.turbo_stream { redirect_to admin_students_path, notice: 'User deleted successfully' }
        format.json { render :show, status: :ok, location: admin_student_url(@student) }
      else
        format.turbo_stream { redirect_to admin_students_path, notice: 'User destroy failed' }
        format.json { render json: @student.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def set_student
    @student = User.find(params[:id])
  end

  def student_params
    params.require(:user).permit(:email, :name, :password, :password_confirmation, :deleted, :current_type, :role, :dateofbirth, :emergency_contact_name, :emergency_contact_number)
  end

  def user_role
    params.require(:user)
  end
end
