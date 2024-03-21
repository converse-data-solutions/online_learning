class Admin::TrainerCoursesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_trainer_course, only: %i[edit update destroy show]

  def index
    @trainer_courses = TrainerCourse.get_trainer_courses(params)
    respond_to do |format|
      format.html { render :index }
      format.turbo_stream
      format.json { render json: @trainer_courses }
    end
  end

  def new
    @trainer_course = TrainerCourse.new
  end

  def create
    @trainer_course = TrainerCourse.new(admin_params)
    respond_to do |format|
      if @trainer_course.save
        @trainer_courses = TrainerCourse.get_trainer_courses(params)
        format.turbo_stream
        format.json { render :create }
      else
        render_invalid_user(format)
      end
    end
  end

  def edit
    render layout: false
    return if @trainer_course

    flash[:alert] = 'User course not found.'
    redirect_to admin_trainer_courses_path
  end

  def update # rubocop:disable Metrics/MethodLength
    respond_to do |format|
      if @trainer_course.update(admin_params)
        @trainer_courses = TrainerCourse.get_trainer_courses(params)
        format.turbo_stream
        format.json { render :show, status: :ok, location: admin_trainer_course_url(@trainer_course) }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.update('edit-user-course-popup', partial: 'admin/trainer_courses/edit', locals: { trainer_course: @trainer_course })
          ]
        end
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy # rubocop:disable Metrics/MethodLength,Metrics/AbcSize
    respond_to do |format|
      if @trainer_course.destroy
        @trainer_courses = TrainerCourse.get_trainer_courses(params)
        format.turbo_stream { render_destroy_success }
        format.json { render :show }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.append('user-course-table', partial: 'shared/flash', locals: { message: 'User course deletion failed.', type: 'notice' }), # rubocop:disable Layout/LineLength
            turbo_stream.update('render-pagination', partial: 'admin/trainer_courses/pagination', locals: { trainer_courses: @trainer_courses })
          ]
        end
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def receive_course_amount
    @course = Course.find_by(id: params[:course_id])
  end

  private

  def render_invalid_user(format)
    format.turbo_stream do
      render turbo_stream: [
        turbo_stream.replace('user-course-admin-form', partial: 'admin/trainer_courses/form', locals: { trainer_course: @trainer_course })
      ]
    end
    format.json { render json: @user.errors, status: :unprocessable_entity }
  end

  def render_destroy_success
    render turbo_stream: [
      turbo_stream.append('user-course-table', partial: 'shared/flash', locals: { message: 'User course was successfully destroyed.', type: 'notice' }),
      turbo_stream.update('user-course-table', partial: 'admin/trainer_courses/table', locals: { trainer_courses: @trainer_courses })
    ]
  end

  def set_trainer_course
    @trainer_course = TrainerCourse.find_by(id: params[:id])
  end

  def admin_params
    params.require(:trainer_course).permit(:user_id, :course_id, :next_payment_date, :enrolled_at, :course_amount)
  end

end
