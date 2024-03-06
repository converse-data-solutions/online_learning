class Admin::EnquiresController < ApplicationController
  before_action :authenticate_user!
  before_action :set_enquire, only: %i[edit update destroy show]

  def index
    @enquires = Enquire.all
    respond_to do |format|
      format.json { render json: @enquires }
      format.html { render :index }
      format.turbo_stream
    end
  end

  def new
    @enquire = Enquire.new
  end

  def create
    @enquire = Enquire.new(enquire_params)
    if @enquire.save
      respond_to do |format|
        format.turbo_stream
        format.json { render :show, status: :created, location: admin_enquire_url(@enquire) }
      end
    else
      format.turbo_stream { render turbo_stream: turbo_stream.replace('user-admin-form', partial: 'admin/students/form', locals: { student: @student }) }
      format.json { render json: @student.errors, status: :unprocessable_entity }
    end
  end

  def edit
    render layout: false
  end

  def update
    respond_to do |format|
      if @enquire.update(enquire_params)
        @enquires = Enquire.all
        format.turbo_stream
        format.json { render :show, status: :ok, location: admin_enquire_url(@enquire) }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.replace('edit-enquire-popup', partial: 'admin/enquires/edit', locals: { enquire: @enquire }) }
        format.json { render json: @enquire.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    respond_to do |format|
      if @enquire.destroy
      @enquires = Enquire.all
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.update("enquire-table", partial: 'admin/enquires/table', locals: { enquires: @enquires }),
          turbo_stream.append("enquire-table", partial: 'shared/flash', locals: { message: 'Enquire deleted successfully.', type: 'notice' })
        ]
      end
      else
        format.turbo_stream { render turbo_stream: turbo_stream.append('enquire-table', partial: 'shared/failed', locals: { message: 'Enquire deletion failed.', type: 'notice' }) }
      end 
    end
  end

  def show
    respond_to do |format|
      format.turbo_stream
      format.json { render :show, status: :ok, location: admin_enquire_url(@enquire) }
    end
  end

  private

  def set_enquire
    @enquire = Enquire.find(params[:id])
  end

  def enquire_params
    params.require(:enquire).permit(:name, :course, :contact, :location, :timeslot, :no_of_people, :status, :follow_up, :remarks, :sales_person, :references, :lead_source)
  end
end
