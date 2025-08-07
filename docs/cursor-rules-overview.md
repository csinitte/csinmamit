# Cursor AI Rules Overview - CSI NMAMIT

## 📋 **Rule Files Summary**

This document provides an overview of all the specialized rule files in `.cursor/rules/` directory, designed to provide comprehensive guidance for AI-assisted development in the CSI NMAMIT project.

## 🔒 **1. security.mdc**
**Purpose**: Core security rules and environment protection

**Key Features**:
- Production environment file protection (`.env`)
- Secret directory protection
- Dangerous code pattern blocking
- Certificate and key file protection
- TypeScript security enforcement

**Protected Files**:
- `.env` (production environment)
- `secrets/`, `private/`, `config/secret/` directories
- Certificate files (`.pem`, `.key`, `.crt`, `.p12`)

## ⚛️ **2. nextjs.mdc**
**Purpose**: Next.js specific patterns and best practices

**Key Features**:
- Pages Router and App Router patterns
- API route security
- tRPC router patterns
- Component naming conventions
- Environment validation protection

**Enforced Patterns**:
- Kebab-case for page files
- PascalCase for components
- CamelCase for utilities
- Read-only protection for critical files

## 🔷 **3. typescript.mdc**
**Purpose**: TypeScript strict mode and type safety rules

**Key Features**:
- Strict TypeScript enforcement
- Type definition patterns
- React component type safety
- API type validation
- Database type protection

**Enforced Rules**:
- No `any`, `Object`, `Function` types
- Strict null checks
- No unused locals/parameters
- Component prop interfaces

## 🗄️ **4. database.mdc**
**Purpose**: Database and Prisma schema protection

**Key Features**:
- Prisma schema protection
- Database connection security
- Migration file protection
- tRPC procedure validation
- Query security patterns

**Protected Files**:
- `prisma/schema.prisma`
- `src/server/db.ts`
- `prisma/migrations/`

**Enforced Patterns**:
- Input/output validation
- Transaction usage
- Error handling
- Environment validation

## 🔐 **5. authentication.mdc**
**Purpose**: NextAuth and authentication security

**Key Features**:
- NextAuth configuration protection
- Session management patterns
- Protected route enforcement
- API security middleware
- Payment security (Razorpay)

**Protected Files**:
- `src/server/auth.ts`
- `src/pages/api/auth/`

**Enforced Patterns**:
- Auth guards on protected routes
- Role-based access control
- Input/output sanitization
- Payment validation

## 🎨 **6. ui-components.mdc**
**Purpose**: UI component patterns and accessibility

**Key Features**:
- Radix UI component usage
- Accessibility enforcement
- Styling patterns (Tailwind CSS)
- Form component patterns
- Animation optimization

**Enforced Patterns**:
- PascalCase component naming
- Accessibility attributes
- Responsive design
- Performance optimization
- Image optimization

## 📊 **7. code-quality.mdc**
**Purpose**: Code quality and best practices enforcement

**Key Features**:
- General code quality standards
- Function and method quality
- Import/export patterns
- Error handling
- Performance optimization

**Enforced Standards**:
- TypeScript usage
- ESLint and Prettier
- Function length limits
- Descriptive naming
- Error boundaries

## 🎯 **Usage Guidelines**

### **For Developers**
1. **Follow Rule Hierarchy**: Security > TypeScript > Next.js > Quality
2. **Use Appropriate Patterns**: Follow the naming conventions specified
3. **Maintain Documentation**: Add JSDoc comments as required
4. **Test Changes**: Ensure all changes follow the established patterns

### **For AI Assistance**
1. **Respect Protected Files**: Never modify read-only files
2. **Follow Naming Conventions**: Use the specified naming patterns
3. **Implement Security**: Always include proper validation and error handling
4. **Maintain Quality**: Follow the code quality standards

### **For Code Review**
1. **Check Rule Compliance**: Ensure all changes follow the established rules
2. **Verify Security**: Confirm no security patterns are bypassed
3. **Validate Types**: Ensure TypeScript strict mode compliance
4. **Test Functionality**: Verify all changes work as expected

## 🔄 **Rule Updates**

### **When to Update Rules**
- New security threats identified
- Framework updates (Next.js, TypeScript)
- New dependencies added
- Team feedback and improvements
- Compliance requirements changes

### **Update Process**
1. Identify the need for rule changes
2. Update the specific rule file
3. Test the changes with AI tools
4. Update documentation
5. Inform team members

## 📈 **Monitoring and Compliance**

### **Regular Checks**
- Monthly rule effectiveness review
- Quarterly security pattern updates
- Annual compliance assessment
- Continuous AI tool behavior monitoring

### **Compliance Metrics**
- Security violation prevention
- Code quality improvement
- TypeScript strict mode compliance
- Accessibility standards adherence

---

**Last Updated**: [Current Date]
**Version**: 1.0
**Maintainer**: Development Team 