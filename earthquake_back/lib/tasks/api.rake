namespace :api do
  desc "Getting data from earthquake.usgs.gov"
  task fetchData: :environment do

    print "Fetching data..."
    
    earthquakeSite = URI('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson')
    response = Net::HTTP.get(earthquakeSite)

    data = JSON.parse(response)

    loading = 0;
    nuevos = 0;
    data['features'].each do |item|
      unless existe(item['id'])
        properties = item['properties']
        geometry = item['geometry']
        coordinates = geometry['coordinates']

        feature = Feature.new({
        type: item['type'],
        attributess: {
          external_id: item['id'],
          magnitude: properties['mag'],
          place: properties['place'],
          time: properties['time'],
          tsunami: properties['tsunami'],
          mag_type: properties['magType'],
          title: properties['title'],
          coordinates: {
            longitude: coordinates[0],
            latitude: coordinates[1],
          }
        },
        links: { 
          external_url: properties['url']
          }
        })
        feature.save
        nuevos += 1
      end
      loading += 1
      if (loading % 100) == 0
        print "."
      end
    end    
    puts " Insertados: #{nuevos}."
  end

  def existe(value)
    Feature.where('attributess.external_id' => value).exists?
  end

end
