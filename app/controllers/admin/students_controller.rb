# frozen_string_literal: true

class Admin::StudentsController < ApplicationController
  before_action :set_student, only: %i[edit update destroy show]
  def index
    get_students
    respond_to do |format|
      format.json { render json: { data: @students, total_count: User.student.count } }
      format.html { render :index }
      format.turbo_stream
    end
  end

  def new
    @student = User.new
  end

  def create # rubocop:disable Metrics/AbcSize,Metrics/MethodLength,Lint/RedundantCopDisableDirective
    @student = User.new(student_params)
    respond_to do |format|
      if @student.add_role_and_save(student_params[:role])
        format.turbo_stream { render turbo_stream: turbo_stream.replace('user-admin-form', partial: 'admin/students/show', locals: { student: @student }) }
        format.json { render :show, status: :created, location: admin_student_url(@student) }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.replace('user-admin-form', partial: 'admin/students/form', locals: { student: @student }) }
        format.json { render json: @student.errors, status: :unprocessable_entity }
      end
    end
    
  end

  def edit
    render layout: false
    return if @student

    flash[:alert] = 'Student not found.'
    redirect_to admin_students_path
  end

  def update
    respond_to do |format|
      if @student.update(student_params)
        format.turbo_stream { redirect_to admin_students_path, notice: 'Student updated successfully' }
        format.json { render :show, status: :ok, location: admin_student_url(@student) }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.update('edit-student-popup', partial: 'admin/students/edit', locals: { student: @student }) }
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

  def get_students
    @students = User.student.includes(user_courses: [:course]).search_by_name_and_email(params[:search]).paginate(page: params[:page] || 1, per_page: params[:per_page] || 5)
  end

  def set_student
    @student = User.find_by(id: params[:id])
  end

  def student_params
    params.require(:user).permit(:email, :name, :password, :password_confirmation, :gender, :deleted, :current_type, :role, :dataofbirth, :emergency_contact_name, :emergency_contact_number, :occupation, :education, :addresses, :contact_number, course_ids: [])
  end

  def user_role
    params.require(:user)
  end
end
