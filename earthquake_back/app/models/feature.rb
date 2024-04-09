class Feature
  include Mongoid::Document
  include Mongoid::Timestamps
  field :id, type: String
  field :type, type: String
  field :attributess, type: Object
  #field :properties, type: Object
  field :links, type: Object
end