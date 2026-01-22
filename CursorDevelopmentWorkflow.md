# 🚀 Cursor Development Workflow

## 📋 Quick Reference Card

### Before You Start
- [ ] Have `PROJECT_CONTEXT.md` updated
- [ ] Know what you're building/fixing
- [ ] Identify if it's simple or complex

---

## 🎯 Workflow by Task Type

### ✨ COMPLEX ANIMATIONS / NEW BEHAVIORS
**Example:** Timeline with ScrollTrigger, mouse-reactive animations

**Steps:**
1. **Chat + Sonnet** - Discuss the idea
   ```
   "I want to add [animation/behavior]"
   Include: @PROJECT_CONTEXT.md
   ```
   - Explain the desired effect in detail
   - Ask if similar patterns exist
   - Clarify desktop vs mobile behavior

2. **Create a Plan** (if multi-step)
   - Break down: setup → desktop → mobile → edge cases
   - **Review the plan before executing**

3. **Composer + Opus** - Build it
   ```
   Reference: @PROJECT_CONTEXT.md
   Reference: @SimilarComponent.astro (if exists)
   
   [Paste the plan or detailed explanation]
   
   Follow existing GSAP patterns.
   Use Tailwind for layout, CSS only for animation transforms.
   ```

---

### 🎨 STYLING FIXES / ADJUSTMENTS
**Example:** Fix inconsistent spacing, adjust colors, layout tweaks

**Steps:**
1. **Composer + Sonnet** - Direct fix
   ```
   Fix styling in @Component.astro
   Reference: @PROJECT_CONTEXT.md (styling section)
   
   [Describe what needs to change]
   
   Follow Tailwind-first approach.
   ```

---

### 🧩 NEW COMPONENTS
**Example:** Adding a new section, card, navigation element

**Steps:**
1. **Chat + Sonnet** - Check for reusable parts
   ```
   "I want to add [component description]"
   Reference: @PROJECT_CONTEXT.md
   
   Can I reuse any existing components?
   ```

2. **Composer + Sonnet** - Build it
   ```
   Create [component] based on discussion.
   Reference: @SimilarComponent.astro
   Reference: @PROJECT_CONTEXT.md
   
   Follow existing patterns and styling approach.
   ```

---

### 🐛 BUG FIXES
**Example:** Animation not working, scroll issue, responsive problem

**Steps:**
1. **Chat + Sonnet** - Debug discussion
   ```
   "I'm getting [error/issue]"
   Reference: @BrokenComponent.astro
   
   [Paste error if available]
   ```

2. **Composer + Sonnet** - Apply fix
   ```
   Fix the issue in @Component.astro
   
   [Include the solution discussed in chat]
   ```

---

## 🔄 Chat Management

### ✅ KEEP THE SAME CHAT when:
- Iterating on the same feature
- Making related changes
- Building connected components
- Working on animation refinements

### 🗑️ CLEAR CHAT when:
- Switching from animations to styling work
- Moving to completely unrelated features
- Chat history is very long (10+ exchanges)
- Getting confused/inconsistent responses

---

## 💾 Model Selection Guide

| Task Type | Model | Why |
|-----------|-------|-----|
| Planning & Discussion | Sonnet | Fast, cheap, smart enough |
| Simple changes | Sonnet | Cost-effective |
| Complex animations | **Opus** | Best reasoning for intricate logic |
| Bug fixing | Sonnet | Usually sufficient |
| Initial codebase analysis | Opus | One-time investment |

**Default to Sonnet. Use Opus only for complex animations.**

---

## 📝 Essential Prompting Patterns

### Always Include:
```
Reference: @PROJECT_CONTEXT.md
```

### For Animations:
```
Desktop behavior: [explain]
Mobile behavior: [explain]
Follow existing GSAP patterns.
Use Tailwind for layout, CSS for transforms.
```

### For New Components:
```
Should reuse: [existing component if applicable]
Follow patterns from: @SimilarComponent.astro
```

### For Fixes:
```
Current issue: [describe]
Expected behavior: [describe]
```

---

## 🎯 Pro Tips

### ⚡ Save Tokens:
- Use Chat for questions → Composer for building
- Use `@filename` not `@codebase` when possible
- Review Plans before executing
- Don't repeat yourself—Cursor has chat history

### 🎨 Styling Rule:
- **Default:** Tailwind classes in HTML
- **Exception:** Plain CSS when GSAP needs precise control of transforms
- **Document it:** When using CSS, add comment explaining why

### 📦 After Building Something Major:
Update `PROJECT_CONTEXT.md`:
```md
# CHANGELOG
- [Today's date]: Added [component/feature]
  - New pattern: [if applicable]
  - Gotcha: [any important notes]
```

---

## 🚨 Red Flags (Stop & Think)

❌ Cursor suggests breaking desktop scroll behavior  
❌ Mixing Tailwind and CSS without clear reason  
❌ Not following existing GSAP patterns  
❌ Creating new component when similar one exists  

**→ Reference PROJECT_CONTEXT.md and existing code**

---

## 🎬 Quick Start Template

**Every time you start working:**

1. What am I doing? → Pick workflow above
2. Do I need context? → Add `@PROJECT_CONTEXT.md`
3. Is it complex? → Use Chat first, then Plan
4. Is it simple? → Straight to Composer
5. Execute with right model
6. Update docs if needed

**That's it. Keep it simple.**