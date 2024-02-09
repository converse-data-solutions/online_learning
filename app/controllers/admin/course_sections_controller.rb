class Admin::CourseSectionsController < ApplicationController

  def index
    @course_sections = Section.get_sections(params)
    respond_to do |format|
      format.json { render json: { data: @sections, total_count: Section.count } }
      format.html { render :index }
      format.turbo_stream
    end
  end

  def new
    @course_section = Section.new
  end

  def create
    @course_section = Section.new(section_params)
    respond_to do |format|
      if @course_section.save
        @course_sections = Section.get_sections(params)
        format.turbo_stream
        format.json { render :create }
      else
        render_invalid_section(format)
      end
    end
  end

  def edit
    @course_section = Section.find_by(id: params[:id])
  end

  def update
    @course_section = Section.find_by(id: params[:id])
    respond_to do |format|
      if @course_section.update(section_params)
        @course_sections = Section.get_sections(params)
        format.turbo_stream
        format.json { render :show, status: :ok, location: admin_course_section_url(@course_section) }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.update('edit-section-popup', partial: 'admin/course_sections/edit', locals: { course_section: @course_section }),
            turbo_stream.append('section-table', partial: 'shared/failed', locals: { message: 'Section update failed.', type: 'notice' })
          ]
        end
      end
    end
  end

  def destroy # rubocop:disable Metrics/MethodLength,Metrics/AbcSize
    @course_section = Section.find_by(id: params[:id])
    respond_to do |format|
      if @course_section.destroy
        @course_sections = Section.get_sections(params)
        format.turbo_stream { render_destroy_success }
        format.json { render :show }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.append('section-table', partial: 'shared/failed', locals: { message: 'Section destroy failed.', type: 'notice' }),
            turbo_stream.update('render-pagination', partial: 'admin/course_sections/paginate', locals: { course_sections: @course_sections })
          ]
        end
        format.json { render json: @course_section.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def render_invalid_section(format)
    format.turbo_stream do
      render turbo_stream: [
        turbo_stream.replace('section-index-form', partial: 'admin/course_sections/form', locals: { course_section: @course_section }),
        turbo_stream.append('section-table', partial: 'shared/failed', locals: { message: 'Section creation failed.', type: 'notice' })
      ]
    end
    format.json { render json: @section.errors, status: :unprocessable_entity }
  end

  def render_destroy_success
    render turbo_stream: [
      turbo_stream.append('section-table', partial: 'shared/flash', locals: { message: 'Section was successfully destroyed.', type: 'notice' }),
      turbo_stream.update('section-table', partial: 'admin/course_sections/table', locals: { course_sections: @course_sections })
    ]
  end

  def section_params
    params.require(:section).permit(:title, :description, :course_id)
  end
end
