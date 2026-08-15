create table if not exists public.salary_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  order_id uuid null,
  access_token text unique,
  download_token text unique,
  status text not null default 'draft',
  first_name text,last_name text,email text,phone text,birth_year int,canton text,work_region text,
  job_title text,target_job_title text,industry text,target_industry text,education text,experience_years numeric,
  has_leadership boolean default false,team_size int,workload_percent numeric default 100,
  monthly_gross_salary numeric,annual_gross_salary numeric,target_salary numeric,bonus numeric,thirteenth_salary text,
  benefits jsonb default '[]',deductions jsonb default '[]',skills jsonb default '[]',languages jsonb default '[]',certifications jsonb default '[]',analysis_purpose text,linkedin_url text,notes text,
  benchmark_source_type text default 'web_search',benchmark_search_id uuid,benchmark_confidence numeric,benchmark_id uuid,
  calculated_values jsonb default '{}',analysis_json jsonb,quality_warnings jsonb default '[]',pdf_url text,
  employment_contract_file_url text,job_ad_file_url text,
  created_at timestamptz default now(),updated_at timestamptz default now()
);
create table if not exists public.salary_benchmark_searches (
  id uuid primary key default gen_random_uuid(),salary_analysis_id uuid references public.salary_analyses(id) on delete cascade,status text not null default 'pending',queries jsonb default '[]',raw_results jsonb,benchmark_candidates jsonb default '[]',selected_benchmark jsonb,sources jsonb default '[]',quality_warnings jsonb default '[]',created_at timestamptz default now(),updated_at timestamptz default now()
);
create table if not exists public.salary_benchmark_cache (
  id uuid primary key default gen_random_uuid(),cache_key text unique not null,normalized_role text,industry text,region text,experience_level text,selected_benchmark jsonb,sources jsonb default '[]',confidence_score numeric,created_at timestamptz default now(),expires_at timestamptz
);
create table if not exists public.salary_analysis_files (
  id uuid primary key default gen_random_uuid(),salary_analysis_id uuid references public.salary_analyses(id) on delete cascade,file_name text not null,file_url text not null,file_type text,mime_type text,size_bytes bigint,created_at timestamptz default now()
);
