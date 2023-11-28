# frozen_string_literal: true

# This is an Admin Lesson controller
class Admin::LessonsController < ApplicationController
  # before_action :section_assignment, only: %i[show new create edit update destroy]
  before_action :lesson_assignment, only: %i[show edit update destroy]
  def index
    # @lessons = @section.lessons.includes(clip_attachment: :blob, attachments_attachments: :blob)
    @lessons = Lesson.all
  end

  def new
    @lesson = Lesson.new
  end

  def create
    @lesson = Lesson.new(lesson_params)
    @lesson.save
    render nothing: true, status: 200, content_type: 'text/html'
  end

  def edit; end

  def update
    @lesson.update(lesson_params)
    render nothing: true, status: 200, content_type: 'text/html'
  end

  def destroy
    @lesson.destroy
    redirect_to admin_lessons_path
  end

  def show; end

  private

  def section_assignment
    @section = Section.find(params[:section_id])
  end

  def lesson_assignment
    @lesson = Lesson.find(params[:id])
  end

  def lesson_params
    params.require(:lesson).permit(:title, :description, :section_id, :clip, attachments: [])
  end
end
