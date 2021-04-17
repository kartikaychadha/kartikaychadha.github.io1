module CsvToJson
    require "time"

    class Generator < Jekyll::Generator
        def generate_intersections(site, movement_files)
            data = Hash.new
            data_index = ''
            movement_files.each do |entry|
            path = File.join(site.source, @csv_dir, entry)
            next if File.symlink?(path) && site.safe
            # #csv file data csv
            table = CSV.read(path, :headers => true)

            index = 0
            data_index_number = 1
            table.to_a[1..-1].each do | row|
                row.each do | col |

                    # get city and country name //city_country
                    begin
                        city_country = table[index][0].to_s.gsub(', ', '_').downcase.gsub(' ', '_')
                    rescue ArgumentError
                        next
                    end

                    #get valied date // YYYY-MM
                    data_index = getDate(table[index][2]).strftime('%Y-%m') 
                    if index == 0
                        next
                    end

                    # set new index 
                    if data.key?(data_index) == false
                        data_index_number = 1
                        data[data_index] = {}
                        data[data_index][city_country] = []
                    end

                    
                    begin
                        # oparation start // [YYYY-MM][city_country]
                        data[data_index][city_country.to_s] = {
                            "AuthorID"=> table.headers[1].gsub(' ', ''),
                            "EndCitation"=> table[index][7].to_s,
                            "EndDate"=>  getDate(table[index][6]).strftime('%Y-%m-%d'),
                            "EndType"=> "departure",
                            "EntryIndex"=> index + 1,
                            "Likelihood"=> 3,
                            "Notes"=> "",
                            "PlaceID"=> table[index][8].to_s,
                            "StartCitation"=> "Arthur A. Schomburg papers, 1724-1938, reel 4--Schomburg Center",
                            "StartDate"=> getDate(table[index][2]).strftime('%Y-%m-%d'),
                            "StartType"=> "earliest_presence"
                        }
                        data_index_number += 1
                        rescue ArgumentError
                        
                    end

                    
                end
                index+=1
            end

            
            end
            save(site, 'intersections', pretty_print(data.to_h.to_json))
        end 
    end
end



