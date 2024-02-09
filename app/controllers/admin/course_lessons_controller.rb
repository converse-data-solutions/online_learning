class Admin::CourseLessonsController < ApplicationController

  def index
    @course_lessons = Lesson.get_lessons(params)
    respond_to do |format|
      format.json { render json: { data: @lessons, total_count: Section.count } }
      format.html { render :index }
      format.turbo_stream
    end
  end

  def new
    @course_lesson = Lesson.new
  end

  def create
    @course_lesson = Lesson.new(lesson_params)
    respond_to do |format|
      if @course_lesson.save
        @course_lessons = Lesson.get_lessons(params)
        format.turbo_stream
        format.json { render :create }
      else
        render_invalid_lesson(format)
      end
    end
  end

  def edit
    @course_lesson = Lesson.find_by(id: params[:id])
  end

  def update # rubocop:disable Metrics/MethodLength,Metrics/AbcSize
    @course_lesson = Lesson.find_by(id: params[:id])
    byebug
    respond_to do |format|
      if @course_lesson.update(lesson_params)
        @course_lessons = Lesson.get_lessons(params)
        format.turbo_stream
        format.json { render :show, status: :ok, location: admin_course_lesson_url(@course_lesson) }
      else
        byebug
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.update('edit-lesson-popup', partial: 'admin/course_lessons/edit', locals: { course_lesson: @course_lesson }),
            turbo_stream.append('lesson-table', partial: 'shared/failed', locals: { message: 'Lesson update failed.', type: 'notice' })
          ]
        end
      end
    end
  end

  def destroy # rubocop:disable Metrics/MethodLength,Metrics/AbcSize
    @course_lesson = Lesson.find_by(id: params[:id])
    respond_to do |format|
      if @course_lesson.destroy
        @course_lessons = Lesson.get_lessons(params)
        format.turbo_stream { render_destroy_success }
        format.json { render :show }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.append('lesson-table', partial: 'shared/failed', locals: { message: 'Lesson destroy failed.', type: 'notice' }),
            turbo_stream.update('render-pagination', partial: 'admin/course_lessons/paginate', locals: { course_lessons: @course_lessons })
          ]
        end
        format.json { render json: @course_lesson.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def render_invalid_lesson(format)
    format.turbo_stream do
      render turbo_stream: [
        turbo_stream.replace('lesson-index-form', partial: 'admin/course_lessons/form', locals: { course_lesson: @course_lesson }),
        turbo_stream.append('lesson-table', partial: 'shared/failed', locals: { message: 'Lesson creation failed.', type: 'notice' })
      ]
    end
    format.json { render json: @lesson.errors, status: :unprocessable_entity }
  end

  def render_destroy_success
    render turbo_stream: [
      turbo_stream.append('lesson-table', partial: 'shared/flash', locals: { message: 'Lesson was successfully destroyed.', type: 'notice' }),
      turbo_stream.update('lesson-table', partial: 'admin/course_lessons/table', locals: { course_lessons: @course_lessons }),
    ]
  end

  def lesson_params
    params.require(:lesson).permit(:title, :description, :section_id, :clip, attachments: [])
  end
end
