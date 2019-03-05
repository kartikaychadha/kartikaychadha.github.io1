library(shinydashboard)
library(leaflet)

header <- dashboardHeader(
  title = "Sibille Lab"
)


body <- dashboardBody(
  fluidRow(
    column(width = 9,
      box(width = NULL, solidHeader = TRUE,p(
        class = "text-muted",
        paste("Graph View:") 
      ),
          plotOutput("graph", height = 500)
      ),
      box(width = NULL,p(
        class = "text-muted",
        paste("Data View:")
      ),
          DT::dataTableOutput("dbtable", width = 500) 
      )
    ),
    column(width = 3,
      box(width = NULL, status = "warning",
          uiOutput("organism"),
          uiOutput("data") ,
          uiOutput("gene") ,
          actionButton("do", "Submit"),
         
        p(
          class = "text-muted",
          paste("Note: This form is reactive! Please allow few seconds for Gene Accession Numbers to load."
          )
        )
      )
    )
  )
)


dashboardPage(
  header,
  dashboardSidebar(disable = TRUE),
  body,
  skin = "purple"
)
