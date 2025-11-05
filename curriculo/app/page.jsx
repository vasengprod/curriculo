'use client';
import React, { useState, useEffect, useMemo } from 'react';

const Briefcase = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M10 12h4"/></svg>);
const BookOpen = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>);
const Cpu = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9z"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M20 12h2"/><path d="M2 12h2"/><path d="M14 20h-4"/><path d="M14 4h-4"/><path d="M20 10v4"/><path d="M4 10v4"/></svg>);
const Terminal = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 9 12 4 7"/><line x1="12" y1="17" x2="20" y2="17"/></svg>);
const Users = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const ExternalLink = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14L21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>);
const Download = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);

const GITHUB_USERNAME = "vasengprod"; 
const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`;

const App = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mockData = useMemo(() => ({
    basics: {
      name: "Vinícius de Almeida Silva",
      label: "Analista de Dados Comercial Jr",
      region: "Recife-PE",
      summary: "Olá! Sou um Analista de Dados focado em gerar valor e impulsionar decisões estratégicas.",
      picture: "/perfil.jpeg",
      profiles: [
        { network: "LinkedIn", url: "https://www.linkedin.com/in/vin%C3%ADcius-almeida-3b171b295/" },
        { network: "GitHub", url: `https://github.com/${GITHUB_USERNAME}` },
      ],
    },
   
    work: [
      { name: "Ferreira Costa", position: "Analista de Dados Comercial Jr", startDate: "2024-12", endDate: "Presente", summary: "Desenvolvimento de dashboards e análises de dados estratégicos, integrando informações de diversas áreas para gerar insights e apoiar decisões." }
    ],
    education: [
      { institution: "Universidade Católica de Pernambuco", area: "Sistemas para Internet", studyType: "Tecnólogo", startDate: "2024-08", endDate: "2026-12" }
    ],
    projects: [],
    skills: [
        { name: "React", level: "Avançado" },
        { name: "Next.js", level: "Avançado" },
        { name: "Tailwind CSS", level: "Intermediário" },
        { name: "JavaScript", level: "Avançado" },
        { name: "Node.js", level: "Intermediário" },
    ]
  }), []);

  const fetchWithBackoff = async (url, retries = 3) => {
    const apiKey = "";
    const apiUrl = url.includes('?') ? `${url}&key=${apiKey}` : `${url}?key=${apiKey}`;

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                if (response.status === 404) {
                    console.error(`Usuário GitHub ${GITHUB_USERNAME} não encontrado. Usando mock data.`);
                    return [];
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        } catch (e) {
            console.error(`Tentativa ${i + 1} falhou. Erro:`, e.message);
            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            } else {
                throw new Error("Falha ao buscar dados da API após múltiplas tentativas.");
            }
        }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const githubRepos = await fetchWithBackoff(API_URL);

        // Mapeia os dados do GitHub para a estrutura de projetos esperada
        const processedProjects = githubRepos.map(repo => ({
            name: repo.name,
            description: repo.description || 'Nenhuma descrição disponível.',
            url: repo.html_url,
            language: repo.language, 
        }));

        setPortfolioData({
            basics: mockData.basics, 
            work: mockData.work,
            education: mockData.education,
            skills: mockData.skills,
            projects: processedProjects.length > 0 ? processedProjects : mockData.projects,
        });

      } catch (e) {
        console.warn("Usando dados mockados. Erro ao integrar API GitHub: " + e.message);
        setError("Não foi possível carregar projetos do GitHub. Exibindo dados de demonstração.");
        setPortfolioData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mockData]);

  const data = portfolioData || mockData;

  const Sidebar = ({ currentSection }) => (
    <nav className="fixed left-0 top-0 h-full w-16 bg-gray-900 shadow-lg hidden md:flex flex-col items-center py-6 space-y-8 z-50">
      <a href="#home" className="p-3 text-cyan-400 hover:text-cyan-200 transition duration-300 rounded-full bg-gray-700/50">
        <Users size={24} />
      </a>
      
      <div className="flex flex-col items-center space-y-6">
        <NavItem target="sobre" Icon={Cpu} label="Sobre" current={currentSection} />
        <NavItem target="profissional" Icon={Briefcase} label="Profissional" current={currentSection} />
        <NavItem target="academica" Icon={BookOpen} label="Acadêmica" current={currentSection} />
        <NavItem target="projetos" Icon={Terminal} label="Projetos" current={currentSection} />
      </div>
    </nav>
  );

  const NavItem = ({ target, Icon, label }) => (
    <a 
      href={`#${target}`} 
      className="group relative flex justify-center p-3 text-gray-400 hover:text-cyan-400 transition duration-300 rounded-lg" 
      title={label}
    >
      <Icon size={24} />
      <span className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 w-auto p-2 bg-gray-700 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap hidden md:block">
        {label}
      </span>
    </a>
  );

  const Section = ({ id, title, children, Icon }) => (
    <section id={id} className="min-h-screen pt-24 pb-12 px-4 sm:px-8 lg:px-12 border-b border-gray-800">
      <h2 className="text-4xl font-extrabold text-white mb-8 flex items-center">
        <Icon size={32} className="mr-3 text-cyan-400" />
        {title}
      </h2>
      <div className="space-y-10">
        {children}
      </div>
    </section>
  );

  const HomeSection = () => (
    <Section id="home" title={data.basics.name} Icon={Users}>
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
        <img 
          src={data.basics.picture} 
          alt={`Foto de ${data.basics.name}`} 
          className="w-32 h-32 rounded-full object-cover ring-4 ring-cyan-500/50 shadow-xl"
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/128x128/1e293b/ffffff?text=AVATAR"; }}
        />
        
        <div className="flex-1">
          <p className="text-xl font-semibold text-cyan-400 mb-1">{data.basics.label}</p>
          <p className="text-sm text-gray-400 mb-4">{data.basics.region}</p>
          
          <div className="flex flex-wrap space-x-3">
            {data.basics.profiles.map((profile, index) => (
              <a 
                key={index}
                href={profile.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium text-white bg-gray-700 hover:bg-cyan-600 px-3 py-1 rounded-full transition duration-300"
              >
                {profile.network}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 p-6 bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-4">Sobre Mim (Resumo)</h3>
        <p className="text-gray-300 leading-relaxed">
          {data.basics.summary}
        </p>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold text-white mb-4">Habilidades (Skills)</h3>
        <div className="flex flex-wrap gap-3">
          {data.skills.map((skill, index) => (
            <span 
              key={index} 
              className="px-4 py-2 bg-cyan-700/30 text-cyan-300 rounded-full text-sm font-medium hover:bg-cyan-700 transition duration-300 cursor-default"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );

  const AboutSection = () => {
    const technologies = [
      "React (Componentização e Hooks)", 
      "Next.js (Estrutura de Roteamento)", 
      "Tailwind CSS (Estilização Rápida e Responsiva)", 
      "SVG Inline (Usado para incorporar ícones diretamente no código)", 
      "GitHub API (Integração de Repositórios/Projetos)",
      "Vercel (Plataforma de Deploy)"
    ];

    return (
      <Section id="sobre" title="Sobre o Desenvolvimento do App" Icon={Cpu}>
        <div className="p-6 bg-gray-800 rounded-xl shadow-lg">
          <p className="text-gray-300 mb-6 leading-relaxed">
            Este portfólio foi construído com as seguintes tecnologias, demonstrando o uso de ferramentas modernas para desenvolvimento web. O design é focado em acessibilidade e responsividade, utilizando o tema escuro.
          </p>
          <h3 className="text-xl font-bold text-cyan-400 mb-3">Módulos e Tecnologias Utilizadas:</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-300 list-inside">
            {technologies.map((tech, index) => (
              <li key={index} className="flex items-center">
                <span className="text-cyan-400 mr-2">•</span> {tech}
              </li>
            ))}
          </ul>
        </div>
        {error && (
            <div className="p-4 bg-yellow-900/50 border border-yellow-700 text-yellow-300 rounded-lg">
                <p>{error}</p>
                <p className="text-sm mt-1">Verifique o username '{GITHUB_USERNAME}' na constante GITHUB_USERNAME.</p>
            </div>
        )}
      </Section>
    );
  };

  const AcademicSection = () => (
    <Section id="academica" title="Experiência Acadêmica" Icon={BookOpen}>
      {data.education.length > 0 ? (
        data.education.map((item, index) => (
          <ExperienceCard 
            key={index}
            title={item.institution}
            subtitle={item.area}
            details={item.studyType}
            date={`${item.startDate || 'N/A'} - ${item.endDate || 'N/A'}`}
          >
            {item.summary && <p className="mt-2 text-gray-400">{item.summary}</p>}
          </ExperienceCard>
        ))
      ) : (
        <p className="text-gray-400">Nenhuma experiência acadêmica encontrada na API ou dados de demonstração.</p>
      )}
    </Section>
  );

  const ProfessionalSection = () => (
    <Section id="profissional" title="Experiência Profissional" Icon={Briefcase}>
      {data.work.length > 0 ? (
        data.work.map((item, index) => (
          <ExperienceCard 
            key={index}
            title={item.name}
            subtitle={item.position}
            details={item.summary}
            date={`${item.startDate || 'N/A'} - ${item.endDate || 'Presente'}`}
          >
            {item.highlights && item.highlights.length > 0 && (
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
                    {item.highlights.map((highlight, hIndex) => (
                        <li key={hIndex}>{highlight}</li>
                    ))}
                </ul>
            )}
          </ExperienceCard>
        ))
      ) : (
        <p className="text-gray-400">Nenhuma experiência profissional encontrada na API ou dados de demonstração.</p>
      )}
    </Section>
  );

  const ProjectsSection = () => (
    <Section id="projetos" title="Projetos Desenvolvidos (GitHub API)" Icon={Terminal}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.projects.length > 0 ? (
          data.projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))
        ) : (
          <p className="text-gray-400 col-span-full">Nenhum projeto encontrado no GitHub (Verifique o username) ou dados de demonstração.</p>
        )}
      </div>
    </Section>
  );

  const ExperienceCard = ({ title, subtitle, details, date, children }) => (
    <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-cyan-500 hover:shadow-cyan-500/20 shadow-lg transition duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <span className="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-full whitespace-nowrap">{date}</span>
      </div>
      <p className="text-cyan-400 font-semibold mb-1">{subtitle}</p>
      <p className="text-gray-300 text-sm">{details}</p>
      {children}
    </div>
  );

  const ProjectCard = ({ project }) => (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-cyan-500/30 transition duration-300 transform hover:scale-[1.02]">
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
        {project.language && (
            <span className="text-xs text-cyan-400 bg-cyan-700/20 px-2 py-0.5 rounded-full mb-2 inline-block">{project.language}</span>
        )}
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{project.description || "Descrição não fornecida."}</p>
        
        {project.url && (
          <a 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center text-cyan-400 hover:text-cyan-300 font-medium transition duration-300 text-sm"
          >
            Ver Repositório
            <ExternalLink size={16} className="ml-1" />
          </a>
        )}
      </div>
    </div>
  );


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-cyan-400">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-cyan-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Carregando dados do portfólio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      
      <Sidebar />

      <main className="md:pl-16">
        <HomeSection />
        <AboutSection />
        <ProfessionalSection />
        <AcademicSection />
        <ProjectsSection />

        <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-800">
          Portfólio construído com React, Next.js e Tailwind CSS. Projetos via <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">GitHub API</a>.
        </footer>
      </main>
      
    </div>
  );
};

export default App;