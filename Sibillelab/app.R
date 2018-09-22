library(shiny)
library(RMySQL)

options(mysql = list(
  "host" = "107.180.57.148",
  "port" = 3306,
  "user" = "kchadha",
  "password" = "kartik123"
))
databaseName <- "sibillelab"
table <- "TEST"

loadData <- function() {
  # Connect to the database
  db <- dbConnect(MySQL(), dbname = databaseName, host = options()$mysql$host, 
                  port = options()$mysql$port, user = options()$mysql$user, 
                  password = options()$mysql$password)
  # Construct the fetching query
  column_name="B11_952"
  q1<-paste("SELECT",column_name,"FROM %s",sep = " ")
  query <- sprintf(q1, table)
  # Submit the fetch query and disconnect
  data <- dbGetQuery(db, query)
  dbDisconnect(db)
  data
}



# Define the fields we want to save from the form
fields <- c("name", "used_shiny", "r_num_years")

# Shiny app with 3 fields that the user can submit data for
shinyApp(
  ui = fluidPage(
    DT::dataTableOutput("responses", width = 300) 
    
    
  ),
  server = function(input, output, session) {
    
   
    
    # Show the previous responses
    # (update with current response when Submit is clicked)
    output$responses <- DT::renderDataTable({
      
      loadData()
    })     
  }
)