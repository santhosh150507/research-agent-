# API Contract

## C2 Conventions
- base URL http://localhost:8000/api/v1
- JSON snake_case, integer IDs, single demo user_id=1, no auth
- Errors: `{"error":{"code":"string","message":"string"}}` with proper HTTP status
- Missing data is null
- Long jobs (PDF upload, review) return an id; client polls GET .../{id} with status queued|running|done|failed. 
- Agent progress exposed as agent_trace `[{step,detail,status}]`

## C3 Types
- Level = "High"|"Medium"|"Low"|"Unavailable"
- Paper {id, title, authors:[{id,name}], year|null, venue|null, doi|null, url|null, abstract|null, citation_count|null, open_access|null, source:"demo"|"openalex"|"semantic_scholar"|"arxiv"|"upload", topics[], methods[], datasets[], keywords[]}
- RankSignals {semantic, keyword, topic_match, methodology_match, dataset_match, recency, citations, question_relevance: Level; raw: dict[str, float|null]}
- SourceRef {paper_id, title, authors:[str], year|null, url|null, doi|null, section|null, page|null, quote|null (<=25 words)}
- Claim {id:str, text:str, kind:"sourced"|"synthesis"|"inference", sources:[SourceRef]}
- SearchFilters {year_from?, year_to?, authors?[], venues?[], topics?[], methods?[], datasets?[], min_citations?, open_access?, paper_type?}

## C4 Person 1 endpoints
- POST /query/understand {text, objectives?, methodology_pref?, date_from?, date_to?, domain?} -> {main_topic, concepts[], keywords[], research_area, synonyms[], expanded_queries:[{id,text,type:"synonym"|"related"|"method"|"user"}]}
- POST /search {query, expanded_queries:[str], filters?, sort?:"relevance"|"year"|"citations"|"recency", page?, page_size?, project_id?} -> {search_id,total,page,page_size,items:[{rank,paper,signals}],facets:{years,methods,datasets,topics,venues},agent_trace[]}
- GET /search/{search_id} (same shape; query params page, sort, filters)
- GET /search/{search_id}/stream (SSE of agent_trace, optional)
- GET /papers/{id} -> Paper + chunks_available:bool
- GET /papers/{id}/analysis -> {paper_id, summary, research_problem, methodology, dataset, experiments, metrics, key_findings, contributions, limitations, future_work: Claim[] each, full_text_available:bool}
- GET /papers/{id}/related -> {earlier,later,references,cited_by,similar_method,same_dataset: RelatedItem[]}; RelatedItem={paper,relation:str,explanation:Claim}
- GET /papers/{id}/evolution -> {stages:[{year_range,label,papers:Paper[],explanation:Claim}],earlier_count,later_count}
- POST /papers/{id}/challenges {mode:"challenge"|"conflicting"|"alternative"} -> {items:[{paper,evidence:Claim[] (kind=sourced),interpretation:Claim (kind=inference)}]}
- POST /papers/{id}/qa {question,conversation_id?} -> {answer:Claim[]} (sources carry section)
- POST /upload multipart file(PDF) -> {upload_id,status}
- GET /upload/{upload_id} -> {status,error?,paper?,structure?:{title,authors,year,abstract,keywords,methodology,datasets,findings,limitations,references,future_work}} (any field nullable)
- POST /compare {paper_ids:[int]} -> {papers,rows:[{feature,cells:{paper_id:Claim|null}}],narrative:Claim[]}; features: Research Problem, Methodology, Dataset, Metrics, Results, Contributions, Limitations, Future Work
- GET /graph (query search_id OR paper_ids=1,2,3, depth) -> {nodes:[{id,type:"paper"|"author"|"topic"|"method"|"dataset",label,meta}],edges:[{source,target,type:"cites"|"authored_by"|"about"|"uses_method"|"uses_dataset"|"similar_method"|"same_dataset"|"related"}]}
- GET /methods (search_id) -> {items:[{name,description:Claim,papers,common_uses:Claim[],advantages:Claim[],limitations:Claim[],datasets:[str]}]}
- GET /datasets (search_id, domain?, task?, method?, min_size?) -> {items:[{name,description,domain,size,tasks[],papers,evaluation_use,link}],links:[{method,dataset,paper_ids}]}
- GET /trends (search_id) -> {by_year:[{year,count}],methods_over_time:[{method,series:[{year,count}]}],datasets:[{name,count}],keywords:[{term,direction:"emerging"|"stable"|"declining",series}]}
- GET /trends/year/{year} (search_id) -> {papers}
- POST /gaps {search_id?,paper_ids?} -> {observations:Claim[],opportunities:[{title,description:Claim,wording:"Potentially underexplored"|"Limited evidence was found in the retrieved literature"|"Few papers in the current search set address...",supporting_papers}],caveat:str}
- POST /multi-qa {paper_ids,question} -> {answer:Claim[]}
- POST /literature-review {paper_ids,title} -> {review_id,status}; GET /literature-review/{review_id} -> {status,title,sections:[{heading,blocks:Claim[]}],references:SourceRef[]}
- POST /conversations {project_id?} -> {id}; GET /conversations; GET /conversations/{id}
- POST /conversations/{id}/messages {content} -> {message:{role,content,claims:Claim[]},actions:[{type:"search"|"filter"|"compare"|"gaps"|"clarify",payload}],literature_state:{search_id,paper_ids,filters},agent_trace[]}

## C5 Person 2 endpoints
- GET/PUT /profile {name,interests[],preferred_domains[],favorite_methods[],topics_researching[]}
- GET /library (status?,tag?,collection_id?,bookmarked?,q?) -> {items:[{paper,status:"unread"|"read",bookmarked,tags[],collection_ids[],saved_at}]}
- POST /library/papers {paper_id,tags?,collection_id?}; PATCH /library/papers/{paper_id} {status?,bookmarked?,tags?}; DELETE /library/papers/{paper_id}
- GET/POST /collections; PATCH/DELETE /collections/{id}; POST/DELETE /collections/{id}/papers/{paper_id}  ({id,name,description,paper_count})
- GET/POST /papers/{id}/notes; PATCH/DELETE /notes/{note_id}  ({id,paper_id,body,created_at})
- GET/POST /papers/{id}/annotations; PATCH/DELETE /annotations/{id}  ({id,paper_id,section,page,text_selection,comment})
- GET /history -> {items:[{search_id,query,created_at,result_count,saved_count,related_topics[]}]}; GET /history/{id}; DELETE /history/{id}
- GET /dashboard -> {active_topics[],recent_papers,saved_count,recent_searches[],emerging_topics[],recommended,activity:[{date,count}]}
- GET /recommendations -> {items:[{paper,reason:Claim(kind=synthesis)}]}
- GET /export/review/{review_id}?format=pdf|md|docx

## C6 DB tables
Users, ResearchProfiles, ResearchProjects, Papers, Authors, PaperAuthors, Topics, Methods, Datasets, PaperMethods, PaperDatasets, Citations, SearchQueries, SearchResults, SavedPapers, Collections, Notes, Annotations, ResearchConversations, ConversationMessages, PaperChunks, Embeddings, LiteratureReviews, CollectionPapers.
