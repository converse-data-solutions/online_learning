# frozen_string_literal: true

# This is an Admin Lesson controller
class Admin::LessonsController < ApplicationController
  before_action :section_assignment, only: %i[show new create edit update destroy]
  before_action :lesson_assignment, only: %i[show edit update destroy]
  def index
    # @lessons = @section.lessons.includes(clip_attachment: :blob, attachments_attachments: :blob)
    @lessons = Lesson.all
  end

  def new
    @lesson = @section.lessons.new
  end

  def create
    @lesson = @section.lessons.create(lesson_params)
    if @lesson.save
      redirect_to admin_section_lessons_path
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit; end

  def update
    if @lesson.update(lesson_params)
      redirect_to admin_section_lessons_path
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @lesson.destroy
    redirect_to admin_section_lessons_path
  end

  def show; end

  private

  def section_assignment
    @section = Section.find(params[:section_id])
  end

  def lesson_assignment
    @lesson = @section.lessons.find(params[:id])
  end

  def lesson_params
    params.require(:lesson).permit(:title, :description, :section_id, :clip, attachments: [])
  end
end
