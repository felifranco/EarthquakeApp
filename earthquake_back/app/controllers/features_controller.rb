class FeaturesController < ApplicationController
  before_action :set_feature, only: %i[ show update destroy ]

  # GET /features
  def index
    #params
    pagina_actual = 1
    por_pagina = 10
    mag_type = ""

    if defined?(params[:page]) && params[:page]
      pagina_actual = params[:page].to_i
    end

    if defined?(params[:per_page]) && params[:per_page]
      por_pagina = params[:per_page].to_i
    end

    if defined?(params[:mag_type]) && params[:mag_type]
      mag_type = params[:mag_type]
    end

    variable = "value"

    puts "variable unless (value) = -#{variable}- : #{variable.blank?}"

    unless true and variable.blank?
      puts "UNLESS"
    end
    
    @features = []
    if mag_type.in?(["md", "ml", "ms", "mw", "me", "mi", "mb", "mlg"])
      @features = Feature.where(mag_type: mag_type)
    else
      @features = Feature.all
    end

    total_documents = @features.size
    total_pages = total_documents / por_pagina

    puts "total_documents: #{@features.size}"
    puts "total_pages: #{total_pages}"

    render json: {
      data: @features.paginate(page: pagina_actual, per_page: por_pagina),
      pagination: {
        current_page: pagina_actual,
        total: total_pages + 1,
        per_page: por_pagina
      }
    }
  end

  # POST /features
  def create
    @feature = Feature.new(feature_params)

    if @feature.save
      render json: @feature, status: :created, location: @feature
    else
      render json: @feature.errors, status: :unprocessable_entity
    end
  end
  
  private
    # Use callbacks to share common setup or constraints between actions.
    def set_feature
      @feature = Feature.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def feature_params
      params.require(:feature).permit(:features)
    end
end
