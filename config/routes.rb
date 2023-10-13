# frozen_string_literal: true

# Route File
Rails.application.routes.draw do
  get 'comments/create'
  get 'sections/show'
  get 'courses/index'
  get 'courses/show'
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }

  root 'page#index'

  resources :users, only: [] do
    resources :profiles
  end
  resources :entrollments, only: %i[show create]
  # resources :courses do
  #   resources :entrollments
  # end
  resources :courses, only: %i[index show] do
    resources :comments, except: %i[index show]
  end

  resources :sections, only: [] do
    resources :comments, only: [:create]
  end

  resources :lessons, only: [] do
    resources :comments, only: [:create]
  end

  namespace :admin do
    resources :users, only: %i[index edit update create destroy new]
  end

  resources :courses, only: %i[index show]

  resources :courses, only: [] do
    resources :sections, only: %i[index show]
  end
  resources :courses, only: [] do
    resources :sections, only: [] do
      resources :lessons, only: %i[index show]
    end
  end

  resources :courses, only: [] do
    resources :ratings, only: [:create]
  end

  resources :sections, only: [] do
    resources :ratings, only: []
  end

  resources :lessons, only: [] do
    resources :ratings, only: []
  end

  namespace :admin do
    resources :courses do
      resources :sections
    end
  end

  namespace :admin do
    resources :sections, only: [] do
      resources :lessons
    end
  end
  namespace :admin do
    resources :entrollments, only: %i[index] do
      member do
        post :update_status
      end
    end
  end

  namespace :admin do
    resources :entrollment_details, only: []
  end

  resources :lessons, only: %i[index show] do
    resources :entrollment_details, only: %i[show] do
    end
  end

  get 'entollment_details/update_progress', to: 'entrollment_details#update_progress', as: :update_progress
end
