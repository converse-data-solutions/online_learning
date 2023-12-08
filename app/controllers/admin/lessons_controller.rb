# frozen_string_literal: true

# This is an Admin Lesson controller
class Admin::LessonsController < ApplicationController
  before_action :lesson_assignment, only: %i[show edit update destroy]
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
    byebug
    respond_to do |format|
      if @lesson.save
        format.turbo_stream
        @form_cleared = true
      else
        puts "Section not found"
        format.html { render :new }
        format.json { render json: @lesson.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit; end

  def update
    @lesson = Lesson.find(params[:id])
    @lesson.update(lesson_params)
    head :no_content
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

  def lesson_assignment
    @lesson = Lesson.find(params[:id])
  end

  def lesson_params
    params.require(:lesson).permit(:title, :description, :section_id, :clip, attachments: [])
  end
end
