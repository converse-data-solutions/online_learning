Rails.application.routes.draw do
  resources :profiles
  get 'comments/create'
  get 'sections/show'
  get 'courses/index'
  get 'courses/show'
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations',
  }
 

  root 'page#index'
  # get 'admin/users', to: 'admin#users'
resources :entrollments
resources :courses do
  resources :entrollments
end
resources :courses do
  resources :comments, except: [:index, :show]
end

resources :sections do
  resources :comments, only: [:create]
end

resources :lessons do
  resources :comments, only: [:create]
end

  namespace :admin do
    resources :users, only: [:index, :edit, :update, :create, :destroy, :show, :new]
  end

  resources :courses, only: [:index, :show]

  resources :courses do
    resources :sections
  end

  resources :sections do
    resources :lessons
  end

  resources :courses do
    resources :ratings, only: [:create]
  end 
  
  resources :sections do
    resources :ratings, only: [:update]
  end
  
  resources :lessons do
    resources :ratings, only: [:update]
  end
  

  namespace :admin do
    resources :courses do
      resources :sections
    end
  end
  
  namespace :admin do
    resources :sections do
      resources :lessons
    end
  end
  namespace :admin do
    resources :entrollments, only: [:index, :edit, :update, :destroy, :show] do
      member do
        post :update_status
      end
    end
  end
  
end
