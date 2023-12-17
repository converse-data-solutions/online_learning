# frozen_string_literal: true

# Route File
Rails.application.routes.draw do
  get 'comments/create'
  get 'sections/show'
  get 'courses/index'
  get 'courses/show'
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations',
    omniauth_callbacks: 'users/omniauth_callbacks'
  }

  root 'page#index'
  namespace :admin do
    resources :sections
  end
  namespace :admin do
    resources :lessons
  end
  resources :users, only: [] do
    resources :profiles
  end
  resources :payments do
    member do
      get 'invoice'
    end
  end
  # get 'payments/invoice/:id', to: 'payments#invoice', as: :invoice
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

  namespace :admin do
    resources :students, only: %i[index edit update create destroy new show]
  end

  namespace :admin do
    resources :users do
    member do
     get :edit
    end
    end
  end

  resources :courses, only: %i[index show]


  # namespace :admin do
  #   resources :sections
  #   get '', to: 'sections#course_section_index'
  # end

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
    resources :payments
  end

  namespace :admin do
    resources :courses do
      resources :sections, only: %i[index new create edit update destroy show]
      collection do
      get 'sections/all', to: 'sections#all', as: :all_index 
      end
    end
  end

  namespace :admin do
    resources :sections, only: [] do
      resources :lessons do
        collection do
          get 'alter_lesson'
        end
      end
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
