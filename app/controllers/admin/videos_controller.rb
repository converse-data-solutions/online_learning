class Admin::VideosController < ApplicationController
    before_action :check_admin_role

    def index
        @section = Section.find(params[:section_id])
        @videos = @section.videos
    end

    def new
        @section = Section.find(params[:section_id])
        @video = @section.videos.new
    end

    def create
        @section = Section.find(params[:section_id])
        @video = @section.videos.create(video_params)
        if @video.save
            redirect_to admin_section_videos_path
        else
            render :new
        end
    end

    def edit
        @section = Section.find(params[:section_id])
        @video = @section.videos.find(params[:id])
    end

    def update
        @section = Section.find(params[:section_id])
        @video = @section.videos.find(params[:id])
        if @video.update(video_params)
            redirect_to admin_section_videos_path
        else
            render :edit
        end
    end

    def destroy
        @section = Section.find(params[:section_id])
        @video = @section.videos.find(params[:id])
        @video.destroy
        redirect_to admin_section_videos_path
    end

    def show
        @section = Section.find(params[:section_id])
        @video = @section.videos.find(params[:id])
    end

    private

    def video_params
        params.require(:video).permit(:title, :description, :section_id, :clip)
    end

end
