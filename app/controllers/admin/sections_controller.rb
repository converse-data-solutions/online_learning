# frozen_string_literal: true

# This is an Admin Section controller
class Admin::SectionsController < ApplicationController
  before_action :section_assignment, only: %i[show edit update]
  require 'will_paginate/array'

  def all
    @sections = Course.last.sections
  end

  def index
    if params[:course_id].present?
      @course = Course.find(params[:course_id])
      @sections = @course.sections
      respond_to(&:js)
    else
      @sections = []
      @sections = Section.all.includes(:course)
      #.each do |section|
        # @sections.push(section)
      # end
      @sections = @sections.paginate(page: params[:page], per_page: 5)
    end
  end

  def new
    @section = Sections.new
  end

  def create # rubocop:disable Metrics/MethodLength
    @section = Section.new(section_params)
    puts "Request Format: #{request.format}"
    respond_to do |format|
      if @section.save
        format.html { redirect_to admin_sections_path }
        format.turbo_stream
        @form_cleared = true

      else
        format.html { render :new }
        format.json { render json: @section.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit; end

  def update
    @section = Section.find(params[:id])
    @section.update(section_params)
    head :no_content
  end

  def show; end

  def destroy
    @section = Section.find(params[:id])
    @section.destroy
  end

  private

  def course_assignment
    @course = Course.find(params[:course_id])
  end

  def section_assignment
    @section = Section.find(params[:id])
  end

  def section_params
    params.require(:section).permit(:title, :description, :course_id)
  end
end
