class Admin::TrainersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_trainer, only: %i[edit update destroy show]

  def index
    @trainers = Trainer.get_trainers(params)
    respond_to do |format|
      format.json { render json: { data: @trainers, total_count: Trainer.trainer.count } }
      format.html { render :index }
      format.turbo_stream
    end
  end

  def new
    @trainer = Trainer.new
    @trainer.build_profile # Build associated profile for the trainer
  end

  def create # rubocop:disable Metrics/AbcSize,Metrics/MethodLength,Lint/RedundantCopDisableDirective
    @trainer = Trainer.new(trainer_params)
      respond_to do |format|
      if @trainer.add_role_and_save(trainer_params[:role])
        @trainers = Trainer.get_trainers(params)
        format.turbo_stream
        format.json { render :show, status: :created, location: admin_trainer_url(@trainer) }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.replace('trainer-admin-form', partial: 'admin/trainers/form', locals: { trainer: @trainer })
          ]
        end
        format.json { render json: @trainer.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit
    render layout: false
    return if @trainer

    flash[:alert] = 'trainer not found.'
    redirect_to admin_trainers_path
  end

  def update # rubocop:disable Metrics/MethodLength,Metrics/AbcSize
    respond_to do |format|
      if @trainer.update(trainer_params)
        @trainers = Trainer.get_trainers(params)
        format.turbo_stream
        format.json { render :show, status: :ok, location: admin_trainer_url(@trainer) }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.update('edit-trainer-popup', partial: 'admin/trainers/edit', locals: { trainer: @trainer })
          ]
        end
        format.json { render json: @trainer.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy # rubocop:disable Metrics/MethodLength,Metrics/AbcSize
    respond_to do |format|
      @trainer.deleted = true
      if @trainer&.save(validate: false)
        @trainers = Trainer.get_trainers(params)
        format.turbo_stream do
          render turbo_stream: [
           turbo_stream.append('trainer-table', partial: 'shared/flash', locals: { message: 'Trainer deleted successfully.', type: 'notice' }),  # rubocop:disable Layout/FirstArrayElementIndentation
           turbo_stream.update('trainer-table', partial: 'admin/trainers/table', locals: { trainers: @trainers })
          ]
        end
        format.json { render :show, status: :ok, location: admin_trainer_url(@trainer) }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.append('trainer-table', partial: 'shared/failed', locals: { message: 'Trainer deletion failed.', type: 'notice' }) }
        format.json { render json: @trainer.errors, status: :unprocessable_entity }
      end
    end
  end

  def show
    respond_to do |format|
      format.turbo_stream
      format.json { render :show, status: :ok, location: admin_trainer_url(@trainer) }
    end
  end

  private

  def set_trainer
    @trainer = Trainer.find_by(id: params[:id])
  end

  def trainer_params
    params.require(:trainer).permit(
      :name, :email, :password, :password_confirmation, :gender, :dataofbirth,
      :contact_number, :occupation, :education, :addresses, :emergency_contact_name,
      :emergency_contact_number, :role,
      profile_attributes: [:id, :alternate_phone, :office_email, :higher_education, :idcard_type, :idcard_no]
    )
  end
end
