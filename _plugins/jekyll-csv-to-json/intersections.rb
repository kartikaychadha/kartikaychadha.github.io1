module CsvToJson
    require "time"

    class Generator < Jekyll::Generator


        def nextCehck(site, row)
            min_range = site.config['min_date_range'] + "01".to_i
            max_range = site.config['min_date_range'] + 120
            max_range += "01".to_i

            return if index == 0 

            return true
        end

        def generate_intersections(site, movement_files)


            data = Hash.new
            start_date = ''
            movement_files.each do |entry|
                # #csv file data csv
                table = read_csv(site, entry)
                index = 0
                start_date_number = 1
                table.to_a[1..-1].each do | row|
                    row.each do | col |

                        # next if nextCehck(site, (table[index])

                        #get valied date // YYYY-MM
                        start_date = getDate(table[index][2]).strftime('%Y-%m') 
                        finish_date = table[index][5] 
                        start_date_to_i = start_date.gsub('-', '')
                        # check finish date
                        if finish_date != ""
                            finish_date = getDate(finish_date).strftime('%Y%m').to_i
                        end
                        
                    

                
                    end
                    index+=1
                end

            end
            # save(site, 'intersections', pretty_print(data.to_h.to_json))
        #    save(site, 'intersections', pretty_print(data.to_h.to_json))
        end 
    end
end



