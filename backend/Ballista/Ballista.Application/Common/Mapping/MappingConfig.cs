using AutoMapper;
using Ballista.Application.DTOs;
using Ballista.Domain.Entities;

namespace Ballista.Application.Common.Mapping
{
    public class MappingConfig
    {
        public static MapperConfiguration RegisterMaps()
        {
            var mappingConfig = new MapperConfiguration(config =>
            {
                // Shot
                config.CreateMap<ShotDto, Shot>().ReverseMap();

                // ShootingSession (GET)
                config.CreateMap<ShootingSession, ShootingSessionViewDto>()
                    .ForMember(dest => dest.Discipline, opt => opt.MapFrom(src => src.Discipline.Name))
                    .ForMember(dest => dest.WeaponType, opt => opt.MapFrom(src => src.WeaponType.Name))
                    .ForMember(dest => dest.TotalScore, opt => opt.MapFrom(src => src.TotalScore))
                    .ForMember(dest => dest.TrainingDuration, opt => opt.MapFrom(src => src.TrainingDuration)); // Добавлено

                // ShootingSession (POST)
                config.CreateMap<CreateShootingSessionDto, ShootingSession>()
                    .ForMember(dest => dest.User, opt => opt.Ignore())
                    .ForMember(dest => dest.Discipline, opt => opt.Ignore())
                    .ForMember(dest => dest.WeaponType, opt => opt.Ignore())
                    .ForMember(dest => dest.Id, opt => opt.Ignore())
                    .ForMember(dest => dest.TotalScore, opt => opt.Ignore())
                    .ForMember(dest => dest.TrainingDuration, opt => opt.MapFrom(src => src.TrainingDuration)); // Добавлено

                // Остальные маппинги остаются без изменений
                config.CreateMap<Discipline, DisciplineDto>().ReverseMap();
                config.CreateMap<WeaponType, WeaponTypeDto>().ReverseMap();

                config.CreateMap<Friendship, FriendshipDto>()
                    .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName))
                    .ForMember(dest => dest.FriendName, opt => opt.MapFrom(src => src.Friend.UserName))
                    .ReverseMap();

                // ExerciseTemplate
                config.CreateMap<ExerciseTemplate, ExerciseTemplateDto>()
                      .ForMember(d => d.DisciplineName,
                                 opt => opt.MapFrom(src => src.Discipline.Name));

                config.CreateMap<ExerciseTemplateDto, ExerciseTemplate>()
                      .ForMember(dest => dest.Discipline, opt => opt.Ignore());
            });

            return mappingConfig;
        }
    }
}