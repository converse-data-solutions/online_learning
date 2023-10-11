# frozen_string_literal: true

# This is an Admin Lesson controller
class Admin::LessonsController < ApplicationController
  def index
    @section = Section.find(params[:section_id])
    @lessons = @section.lessons
  end

  def new
    @section = Section.find(params[:section_id])
    @lesson = @section.lessons.new
  end

  def create
    @section = Section.find(params[:section_id])
    @lesson = @section.lessons.create(lesson_params)
    if @lesson.save
      redirect_to admin_section_lessons_path
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @section = Section.find(params[:section_id])
    @lesson = @section.lessons.find(params[:id])
  end

  def update
    @section = Section.find(params[:section_id])
    @lesson = @section.lessons.find(params[:id])
    if @lesson.update(lesson_params)
      redirect_to admin_section_lessons_path
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @section = Section.find(params[:section_id])
    @lesson = @section.lessons.find(params[:id])
    @lesson.destroy
    redirect_to admin_section_lessons_path
  end

  def show
    @section = Section.find(params[:section_id])
    @lesson = @section.lessons.find(params[:id])
  end

  private

  def lesson_params
    params.require(:lesson).permit(:title, :description, :section_id, :clip, attachments: [])
  end
end
