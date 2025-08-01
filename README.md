# Dev Portfolio - Project Documentation

## Overview

Dev Portfolio is a modern, full-stack portfolio website built with React and Node.js. It features a dynamic frontend with an admin panel for content management, comprehensive API health monitoring, and a responsive design using Tailwind CSS.

## Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with Vite build tool
- **Styling**: Tailwind CSS for responsive design
- **Routing**: React Router DOM for navigation
- **State Management**: React Context API with custom hooks
- **Icons**: React Icons library

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express.js
- **Authentication**: JWT-based authentication
- **Validation**: Joi schema validation
- **Testing**: Jest testing framework
- **Data Storage**: JSON file-based storage

## Key Features

### 1. Portfolio Display
- **Hero Section**: Personal introduction and call-to-action
- **About Section**: Personal background and story
- **Skills Section**: Technical skills with proficiency levels
- **Experience Section**: Work history and achievements
- **Projects Section**: Showcase of completed projects
- **Contact Section**: Contact information and form

### 2. Admin Panel
- **Secure Login**: JWT-based authentication
- **Content Management**: Edit all portfolio sections
- **Real-time Updates**: Instant preview of changes
- **Form Validation**: Client and server-side validation
- **Section-specific Editing**: Focused editing for each section

### 3. API Health Monitoring
- **Global Health Checks**: Automatic API availability monitoring
- **Graceful Degradation**: Error pages when API is unavailable
- **Retry Mechanism**: User-initiated retry functionality
- **Loading States**: Clear feedback during API checks


## Technology Stack

### Frontend Dependencies
- **React**: 18.2.0 - UI framework
- **React Router DOM**: 6.22.3 - Client-side routing
- **React Icons**: 5.5.0 - Icon library
- **JWT Decode**: 4.0.0 - JWT token handling

### Development Dependencies
- **Vite**: 5.1.6 - Build tool and dev server
- **Tailwind CSS**: 3.4.1 - Utility-first CSS framework
- **ESLint**: 8.57.0 - Code linting
- **PostCSS**: 8.4.35 - CSS processing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/am-kenny/dev-portfolio.git
   cd dev-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Portfolio: http://localhost:5173
   - Admin Panel: http://localhost:5173/admin


## Development Workflow

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```


## Contributing

### Development Guidelines

1. **Code Style**: Follow ESLint configuration
2. **Component Structure**: Use functional components with hooks
3. **State Management**: Use Context API for global state
4. **Testing**: Write tests for new features
5. **Documentation**: Update docs for new features

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `/docs` folder
- Review the API health check documentation

## Roadmap

### Planned Features

- [ ] Dark mode support
- [ ] Analytics integration
- [ ] SEO optimization
- [ ] Multi-language support
- [ ] Advanced admin features
- [ ] Automated testing
- [ ] CI/CD pipeline 