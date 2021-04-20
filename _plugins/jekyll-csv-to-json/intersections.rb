module CsvToJson
    require "time"

    class Generator < Jekyll::Generator
        def generate_intersections(site, movement_files)
            data = Hash.new
            start_date = ''
            movement_files.each do |entry|
            path = File.join(site.source, @csv_dir, entry)
            next if File.symlink?(path) && site.safe
            # #csv file data csv
            table = CSV.read(path, :headers => true)

            index = 0
            start_date_number = 1
            table.to_a[1..-1].each do | row|
                row.each do | col |
                    status = true

                    if index == 0
                        next
                    end


                    #get valied date // YYYY-MM
                    start_date = getDate(table[index][2]).strftime('%Y-%m') 
                    finish_date = table[index][5] 
                    start_date_to_i = start_date.gsub('-', '')

                    # check finish date
                    if finish_date != ""
                        finish_date = getDate(finish_date).strftime('%Y%m').to_i
                        if finish_date <= site.config['max_date_rage'] + "01".to_i
                            next
                        end
                    end
                    # check start date
                    if 189001 > start_date_to_i.to_i
                        next
                    end
                    if start_date_to_i.to_i > 201001
                        next
                    end

                    # get city and country name //city_country
                    begin
                        city_country = table[index][0].to_s.gsub(', ', '_').downcase.gsub(' ', '_')
                    rescue ArgumentError
                        next
                    end
                 
                    
                    # set new index 
                    if data.has_key?(start_date)
                        start_date_number += 1
                    else
                        start_date_number = 0
                        data[start_date] = {}
                        data[start_date][city_country] = []
                    end

                    begin
                        # oparation start // [YYYY-MM][city_country]
                        data[start_date][city_country.to_s] = {
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
                        start_date_number += 1
                        rescue ArgumentError
                        
                    end
            
                end
                index+=1
            end

            
            end
            save(site, 'intersections', pretty_print(data.to_h.to_json))
        #    save(site, 'intersections', pretty_print(data.to_h.to_json))
        end 
    end
end



