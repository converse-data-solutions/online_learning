Rails.application.routes.draw do
  devise_for :users, controllers: {
    sessions: 'users/sessions'
  }

  root 'page#index'
  get 'admin/users', to: 'admin#users'
end
