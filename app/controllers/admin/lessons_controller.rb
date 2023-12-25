# frozen_string_literal: true

# This is an Admin Lesson controller
class Admin::LessonsController < ApplicationController
  before_action :set_lesson, only: %i[show edit update destroy]
  require 'will_paginate/array'

  def index
    @lessons = []
    Lesson.all.includes(:section, clip_attachment: :blob, attachments_attachments: :blob).each do |lesson|
      @lessons.push(lesson)
    end
    @lessons = @lessons.paginate(page: params[:page], per_page: 5)
  end

  def new
    @lesson = Lesson.new
  end

  def create
    @lesson = Lesson.new(lesson_params)
    respond_to do |format|
      if @lesson.save
        format.html { redirect_to admin_lessons_path }
        format.turbo_stream
      else
        format.html { render :new }
        format.json { render json: @lesson.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit; end

  def update
    respond_to do |format|
      if @lesson.update(lesson_params)
        format.turbo_stream
        format.json { render :show, status: :ok, location: admin_lesson_url(@lesson) }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.update('steeper-edit-lesson-popup', partial: 'admin/lessons/edit', locals: { lesson: @lesson }) }
        format.json { render json: @lesson.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @lesson.destroy
    redirect_to admin_lessons_path
  end

  def show; end


  def alter_lesson
    @lessons = Lesson.where(section_id: params[:section_id])
    @section = Section.find(params[:section_id])
    @section_id = @section.id
    puts "Request Format: #{request.format}"
    respond_to do |format|
      format.turbo_stream
    end
  end

  private

  def section_assignment
    @section = Section.find(params[:section_id])
  end

  def set_lesson
    @lesson = Lesson.find(params[:id])
  end

  def lesson_params
    params.require(:lesson).permit(:title, :description, :section_id, :clip, attachments: [])
  end
end
