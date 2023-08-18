import { Pipe, PipeTransform } from '@angular/core';
import { ProjectDto } from 'src/app/interfaces/project';

@Pipe({
  name: 'project'
})
export class ProjectPipe implements PipeTransform {

  transform(projectId: number, projectList: ProjectDto[] ): string {
    if (!projectId || !projectList || projectList.length === 0) {
      return '';
    };

    const project = projectList.find(t=>t.id===projectId)

    if (!project) {
      return '';
    }
    const name = project.name.charAt(0).toUpperCase() + project.name.slice(1);
    
    return name;
  } 

}
