# frozen_string_literal: true

# This is an Admin Section controller
class Admin::SectionsController < ApplicationController
  before_action :set_section, only: %i[show edit update]
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
        format.turbo_stream { render turbo_stream: turbo_stream.replace( "stepper_section-form", partial: "admin/sections/form", locals: { section: Section.new })}
        format.json { render :show, status: :created, location: @section }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.replace('section-admin-form', partial: 'admin/sections/form', locals: { section: @section }) }
        format.json { render json: @section.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit; end

  def update
    respond_to do |format|
      if @section.update(section_params)
        format.turbo_stream
      else
        format.turbo_stream { render turbo_stream: turbo_stream.update('steeper-edit-section-popup', partial: 'admin/sections/edit', locals: { section: @section }) }
        format.json { render json: @section.errors, status: :unprocessable_entity }
      end
    end
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

  def set_section
    @section = Section.find(params[:id])
  end

  def section_params
    params.require(:section).permit(:title, :description, :course_id)
  end
end
