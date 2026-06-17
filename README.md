# Job Smart Tracker

A smart job tracking application powered by AI agents. Built with Claude Agent SDK (Anthropic ADK), enabling intelligent resume analysis and job matching through composable AI agents.

## 项目概述

该项目是一个 AI 驱动的求职追踪系统，集成 Claude Agent SDK（Anthropic ADK），支持导入和扩展自定义 Agent 来完成不同的智能任务。

核心功能：

- 上传简历后，由 OpenAI 分析简历内容
- 通过 Claude Agent SDK 构建可组合的 AI Agent 流程
- 匹配适合用户的工作机会
- 提供个性化的工作推荐
- 准备部署到线上环境

## Agent 架构

本项目支持通过 Claude Agent SDK 导入和扩展 Agent：

- **Resume Agent** — 负责解析简历、提取技能与经验
- **Match Agent** — 负责将简历与职位要求进行匹配评分
- **Recommend Agent** — 负责生成个性化职位推荐与理由

每个 Agent 职责独立，可单独替换或扩展。

## 目标用户

- 求职者
- 职业顾问
- 人力资源团队

## 主要功能

1. 从简历中提取技能、经验、教育背景等信息
2. 基于用户简历与职位要求进行匹配
3. 生成与用户能力最契合的职位列表
4. 支持后续扩展为在线服务

## 未来方向

- 部署为线上 Web 服务
- 添加用户认证与简历上传功能
- 集成职位搜索 API
- 提供职位匹配评分与匹配理由

## 使用说明

1. 该项目目前为 AI agent 交互与方案设计文档。
2. 后续可补充项目结构、接口说明与部署指南。
