# frozen_string_literal: true

json.array! @batches, partial: 'admin/batches/batch', as: :batch
